import { Context, Response, Input } from '@/domain/contracts/chatbot.interface';
import { EmployeeRepository } from '@/domain/contracts/employee-repository.interface';
import { Contexts } from '@/domain/enums/contexts.enum';
import { Elasticsearch, Server } from '@/config/config';
import * as elasticsearch from 'elasticsearch'
import { createMessage } from '@/domain/helpers/create-message';
import * as cuid from 'cuid';
import { Intent } from '@/domain/enums/intent.enum';
import { Attachment } from '@/domain/models/attachment';
import { extname } from 'path';

export class SaveKnowledge implements Context {

  constructor (
    private readonly contextCode: Contexts,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  public getContextCode (): number {
    return this.contextCode
  };

  getIntent (): Intent {
    return Intent.Teach
  }

  public async onActivity(input: Input): Promise<Response> {

    const messages: Response = []

    const { getLastConversation } = this.employeeRepository
    const getConversation = getLastConversation.bind(this.employeeRepository)

    const askTitleContext = await getConversation(input.employeeId, Contexts.TeachAskTitle)
    const askKnowledgeContext = await getConversation(input.employeeId, Contexts.TeachAskKnowledge)

    const attachments: Attachment[] = await this.employeeRepository
      .getLastAttachments(input.employeeId)

    const title = askTitleContext.typedText
    const knowledge = askKnowledgeContext.typedText

    const client = new elasticsearch.Client({
      hosts: [Elasticsearch.url]
    });

    const validAttachs: Attachment[] = attachments.filter((attach: Attachment) => {
      const ext = extname(attach.filename)
      return Server.acceptedAttachmentFileTypes.includes(ext)
    })

    if (validAttachs.length !== attachments.length) {
      messages.push({
        context: this,
        error: new Error('Invalid attachment!'),
        message: `Arquivos de extensão inválida seão ignorados. Extensões aceitas: ${Server.acceptedAttachmentFileTypes.join(', ')}`,
        delay: 0,
      })
    }

    try {
      await client.create({
        index: 'atomon',
        type: 'knowledge',
        id: cuid(),
        body: {
          title,
          knowledge,
          employeeId: input.employeeId,
          createdAt: Math.floor(Date.now() / 1000),
          attachments: validAttachs.map(
            attachment => attachment.filename)
        }
      })
    } catch (error) {
      return createMessage({
        context: this,
        error,
        message: 'Desculpe, não consegui salvar o conhecimento.',
        delay: 0,
      })
    }

    let nextContext: Contexts = Contexts.Main

    const employee = await this.employeeRepository
      .findById(input.employeeId)

    const updatedEmployee = await this.employeeRepository
      .sumScore(employee.id, employee.tenant.score)

    const level = await this.employeeRepository.reloadLevel(updatedEmployee)
    if (level.id !== updatedEmployee.level.id) {
      nextContext = Contexts.LevelUp
    }

    messages.push({
      context: this,
      fowardTo: nextContext,
      message: `Conhecimento salvo! Você ganhou ${employee.tenant.score} pontos.`,
      delay: 0,
    })

    return messages
  }

  public async onInit(input: Input): Promise<Response> {
    return this.onActivity(input)
  }

  public async onFinish(): Promise<Response> {
    return createMessage(null)
  }
}

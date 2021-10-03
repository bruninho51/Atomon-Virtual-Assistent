import { Context, Response, Input } from '../../contracts/chatbot.interface';
import { EmployeeRepository } from '../../contracts/employee-repository.interface';
import { Contexts } from '../../enums/contexts.enum';
import { Elasticsearch } from '../../../config/config';
import * as elasticsearch from 'elasticsearch'
import { createMessage } from '../../hooks/create-message.hook';
import * as cuid from 'cuid';
import { Intent } from '../../enums/intent.enum';
import { Attachment } from '../../models/attachment';

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
          attachments: attachments.map(
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

    return createMessage({
      context: this,
      fowardTo: nextContext,
      message: `Conhecimento salvo! Você ganhou ${employee.tenant.score} pontos.`,
      delay: 0,
    })
  }

  public async onInit(input: Input): Promise<Response> {
    return this.onActivity(input)
  }

  public async onFinish(): Promise<Response> {
    return createMessage(null)
  }
}

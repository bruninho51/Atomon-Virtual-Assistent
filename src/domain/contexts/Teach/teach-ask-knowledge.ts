import { Context, Response, Input } from '../../contracts/chatbot.interface';
import { Contexts } from '../../enums/contexts.enum';
import { createMessage } from '../../hooks/create-message.hook';
import { EmployeeRepository } from '../../contracts/employee-repository.interface';
import * as cuid from 'cuid';
import { Elasticsearch } from '../../../config/config';
import * as elasticsearch from 'elasticsearch'

export class TeachAskKnowledge implements Context {

  constructor (
    private readonly contextCode: Contexts,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  public getContextCode (): number {
    return this.contextCode
  };

  public async onActivity(input: Input): Promise<Response> {
    // save knowledge on elasticsearch
    const title = (await this.employeeRepository.getLastConversation(input.employeeId)).typedText
    const knowledge = input.text

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
          knowledge
        }
      })

      return createMessage({
        context: this,
        fowardTo: 1,
        message: 'Conhecimento salvo!',
        delay: 0,
      })
    } catch (error) {
      return createMessage({
        context: this,
        error,
        message: 'Desculpe, não consegui salvar o conhecimento.',
        delay: 0,
      })
    }
  }

  public async onInit(): Promise<Response> {
    return createMessage({
      context: this,
      message: 'Por favor, digite o que deseja me ensinar',
      delay: 0,
    })
  }

  public async onFinish(): Promise<Response> {
    return createMessage(null)
  }
}

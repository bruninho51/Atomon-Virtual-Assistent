import { Context, Response, Input } from '../../contracts/chatbot.interface';
import { EmployeeRepository } from '../../contracts/employee-repository.interface';
import { Contexts } from '../../enums/contexts.enum';
import { Elasticsearch } from '../../../config/config';
import * as elasticsearch from 'elasticsearch'
import { createMessage } from '../../hooks/create-message.hook';
import * as cuid from 'cuid';

export class SaveKnowledge implements Context {

  constructor (
      private readonly contextCode: Contexts,
      private readonly employeeRepository: EmployeeRepository,
  ) {}

  public getContextCode (): number {
    return this.contextCode
  };

  public async onActivity(_input: Input): Promise<Response> {
    // save knowledge on elasticsearch
    const title = (await this.employeeRepository.getLastConversation(_input.employeeId, Contexts.TeachAskTitle)).typedText
    const knowledge = (await this.employeeRepository.getLastConversation(_input.employeeId, Contexts.TeachAskKnowledge)).typedText

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
        fowardTo: Contexts.Main,
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
    return this.onActivity({} as Input)
  }

  public async onFinish(): Promise<Response> {
    return createMessage(null)
  }
}

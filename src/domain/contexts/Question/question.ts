import { Context, Response, Input } from '../../contracts/chatbot.interface';
import { Contexts } from '../../enums/contexts.enum';
import { createMessage } from '../../hooks/create-message.hook';

export class Question implements Context {
  constructor (private readonly contextCode: Contexts) {}
  getContextCode (): number {
    return this.contextCode
  }

  public async onActivity(_input: Input): Promise<Response> {
    return createMessage({
      context: this,
      message: 'Você selecionou perguntar!',
      delay: 0,
    })
  }

  public async onInit(): Promise<Response> {
    return createMessage({
      context: this,
      message: 'Você entrou em perguntar!',
      delay: 0,
    })
  }

  public async onFinish(): Promise<Response> {
    return createMessage({
      context: this,
      message: 'Você saiu do perguntar!',
      delay: 0,
    })
  }
}

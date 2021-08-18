import { Context, Response, Input } from '../../contracts/chatbot.interface';
import { Contexts } from '../../enums/contexts.enum';
import { createMessage } from '../../hooks/create-message.hook';

export class Teach implements Context {

  constructor (private readonly contextCode: Contexts) {}

  public getContextCode (): number {
    return this.contextCode
  };

  public async onActivity(_input: Input): Promise<Response> {
    return createMessage({
      context: this,
      message: 'Você selecionou ensinar!',
      delay: 0,
    })
  }

  public async onInit(): Promise<Response> {
    return createMessage({
      context: this,
      message: 'Você entrou ensinar!',
      delay: 0,
    })
  }

  public async onFinish(): Promise<Response> {
    return createMessage({
      context: this,
      message: 'Você saiu do ensinar!',
      delay: 0,
    })
  }
}

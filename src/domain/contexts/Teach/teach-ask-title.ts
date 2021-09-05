import { Context, Response, Input } from '../../contracts/chatbot.interface';
import { Contexts } from '../../enums/contexts.enum';
import { Intent } from '../../enums/intent.enum';
import { createMessage } from '../../hooks/create-message.hook';

export class TeachAskTitle implements Context {

  constructor (private readonly contextCode: Contexts) {}

  public getContextCode (): number {
    return this.contextCode
  };

  getIntent (): Intent {
    return Intent.Teach
  }

  public async onActivity(_input: Input): Promise<Response> {
    return createMessage({
      context: this,
      fowardTo: Contexts.TeachAskKnowledge,
      message: 'Blz..',
      delay: 0,
    })
  }

  public async onInit(): Promise<Response> {
    return createMessage({
      context: this,
      message: 'Qual o título do conhecimento?',
      delay: 0,
    })
  }

  public async onFinish(): Promise<Response> {
    return createMessage(null)
  }
}

import { Context, Response, Input } from '@/domain/contracts/chatbot.interface';
import { Contexts } from '@/domain/enums/contexts.enum';
import { Intent } from '@/domain/enums/intent.enum';
import { createMessage } from '@/domain/helpers/create-message';

export class TeachAskKnowledge implements Context {

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
      fowardTo: Contexts.AskAttachment,
      message: 'Legal!',
      delay: 0,
    })
    
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

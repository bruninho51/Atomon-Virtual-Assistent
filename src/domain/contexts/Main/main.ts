import { Context, Response, Input } from '../../contracts/chatbot.interface';
import { Intent } from '../../enums/intent.enum';
import { createMessage } from '../../hooks/create-message.hook';
import MainMessages from './messages';

export class Main implements Context {

  constructor (private readonly contextCode: number) {}

  getContextCode (): number {
    return this.contextCode
  }

  getIntent (): Intent {
    return Intent.Menu
  }

  public async onActivity(input: Input): Promise<Response> {
    let message = null
    switch (Number(input.text)) {
      case 1:
        message = createMessage({ ...MainMessages.onActivity.onTeach, context: this })
        break;
      case 2:
        message = createMessage({ ...MainMessages.onActivity.onQuestion, context: this })
        break;
      default:
        message = createMessage({ ...MainMessages.onActivity.onInvalidOption, context: this })
    }

    return message
  }

  public async onInit(): Promise<Response> {
    return createMessage({ ...MainMessages.onInit, context: this })
  }

  public async onFinish(): Promise<Response> {
    return createMessage(null)
  }
}

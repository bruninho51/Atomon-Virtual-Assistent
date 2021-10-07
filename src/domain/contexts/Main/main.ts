import { Context, Response, Input } from '@/domain/contracts/chatbot.interface';
import { Intent } from '@/domain/enums/intent.enum';
import { createMessage } from '@/domain/helpers/create-message';
import messages from '@/domain/contexts/Main/messages';

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
        message = createMessage(messages.onTeach(this))
        break;
      case 2:
        message = createMessage(messages.onQuestion(this))
        break;
      case 3:
        message = createMessage(messages.onShowLevel(this))
        break;
      default:
        message = messages.onInvalidOption(this)
        
    }

    return message
  }

  public async onInit(): Promise<Response> {
    return createMessage(messages.onInit(this))
  }

  public async onFinish(): Promise<Response> {
    return createMessage(null)
  }
}

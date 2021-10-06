import { Context, Response, Input } from '@/domain/contracts/chatbot.interface';
import { Intent } from '@/domain/enums/intent.enum';
import { createMessage } from '@/domain/helpers/create-message';
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
      case 3:
        message = createMessage({ ...MainMessages.onActivity.onShowLevel, context: this })
        break;
      default:
        message = [
          {
            context: this,
            message: 'Opção inválida!',
            delay: 0,
            error: new Error('Opção inválida!')
          },
          {
            context: this,
            message: 'Você deseja: <br>1 - Ensinar <br>2 - Perguntar<br>3 - Minha Pontuação<br>Digite o número da opção correspondente',
            delay: 0,
            error: new Error('Opção Inválida!')
          }
        ]
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

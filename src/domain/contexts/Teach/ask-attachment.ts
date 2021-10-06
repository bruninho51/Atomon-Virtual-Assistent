import { Context, Response, Input } from '@/domain/contracts/chatbot.interface';
import { Contexts } from '@/domain/enums/contexts.enum';
import { Intent } from '@/domain/enums/intent.enum';
import { createMessage } from '@/domain/helpers/create-message';

export class AskAttachment implements Context {

  constructor (private readonly contextCode: Contexts) {}

  public getContextCode (): number {
    return this.contextCode
  };

  getIntent (): Intent {
    return Intent.Teach
  }

  public async onActivity(input: Input): Promise<Response> {

    switch (input.text) {
      case '1':
        return createMessage({
          context: this,
          fowardTo: Contexts.Attachment,
          message: 'Blz..',
          delay: 0,
        })
      case '2':
        return createMessage({
          context: this,
          fowardTo: Contexts.SaveKnowledge,
          message: 'Blz..',
          delay: 0,
        })
      default:
        return createMessage({
          context: this,
          error: new Error(),
          message: 'Opção inválida!',
          delay: 0,
        })
    }
  }

  public async onInit(): Promise<Response> {
    return createMessage({
      context: this,
      message: 'Deseja cadastrar um anexo? Digite 1 para sim e 2 para não.',
      delay: 0,
    })
  }

  public async onFinish(): Promise<Response> {
    return createMessage(null)
  }
}

import { Context, Response, Input } from '../../contracts/chatbot.interface';
import { Contexts } from '../../enums/contexts.enum';
import { createMessage } from '../../hooks/create-message.hook';

export class AskAttachment implements Context {

  constructor (private readonly contextCode: Contexts) {}

  public getContextCode (): number {
    return this.contextCode
  };

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

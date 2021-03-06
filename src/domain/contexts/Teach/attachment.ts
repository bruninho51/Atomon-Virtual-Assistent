import { Context, Response, Input } from '@/domain/contracts/chatbot.interface';
import { Contexts } from '@/domain/enums/contexts.enum';
import { Intent } from '@/domain/enums/intent.enum';
import { createMessage } from '@/domain/helpers/create-message';

export class Attachment implements Context {

  constructor (private readonly contextCode: Contexts) {}

  public getContextCode (): number {
    return this.contextCode
  };

  getIntent (): Intent {
    return Intent.Teach
  }

  public async onActivity(_input: Input): Promise<Response> {

    if (_input.text === '1') {
      return createMessage({
        context: this,
        fowardTo: Contexts.SaveKnowledge,
        message: 'Blz..',
        delay: 0,
      })
    }

    return createMessage({
      context: this,
      message: 'Valeu pelos arquivos! Digite 1 para finalizar, ou anexe outros arquivos',
      attachments: _input.attachments ?? null,
      delay: 0,
    })
  }

  public async onInit(): Promise<Response> {
    return createMessage({
      context: this,
      message: 'Por favor, anexe o arquivo que você deseja atrelar ao conhecimento.',
      delay: 0,
    })
  }

  public async onFinish(): Promise<Response> {
    return createMessage(null)
  }
}

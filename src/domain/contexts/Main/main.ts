import { Context, Response, Message, Input } from '../../contracts/chatbot.interface';
import MainMessages from './messages';

export class Main implements Context {
  public async onActivity(input: Input): Promise<Response> {

    if (input.text === 'sair') {
      return {
        message: 'Você solicitou sair do menu principal!',
        context: 1,
        delay: 0
      }
    }

    return {
      message: 'Você está no menu principal!',
      delay: 0
    }
  }

  public async onInit(): Promise<Message> {
    return MainMessages.onInit;
  }

  public async onFinish(): Promise<Message> {
    return MainMessages.onFinish;
  }
}

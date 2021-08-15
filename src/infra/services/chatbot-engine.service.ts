
import { Message, Input, Context } from "../../domain/contracts/chatbot.interface";
import { getContext } from "../../domain/hooks/get-context.hook";
import { Conversation } from "../../domain/models/conversation";

export class ChatbotEngineService {
  public async execute (input: Input, conversation?: Conversation): Promise<Message[]> {
    const messages: Message[] = [];
    let context = conversation?.context ?? 0;
  
    if (!conversation?.isStarted) {
      await this.onInitHelper(await getContext(context), messages);
    }
  
    if (conversation?.isStarted) {
      const replyMessage = await (await getContext(context)).onActivity(input);
      if (replyMessage !== null) {
        messages.push(replyMessage);
        if (Number.isInteger(replyMessage['context'])) { // is foward message
          console.log('context: ', replyMessage['context'])
          await this.onFinishHelper(await getContext(context), messages);
          context = replyMessage['context'];
          await this.onInitHelper(await getContext(context), messages);
        }
      }
    }

    return messages;
  }
  
  private async onInitHelper(context: Context, messages: Message[]): Promise<void> {
    const message = await context.onInit();
    if (message) {
      messages.push(message);
    }
  }
  
  private async onFinishHelper(context: Context, messages: Message[]): Promise<void> {
    const message = await context.onFinish();
    if (message) {
      messages.push(message);
    }
  }
}

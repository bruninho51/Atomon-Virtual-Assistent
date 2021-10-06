import { Input, Speak, Foward, Response, Context } from "@/domain/contracts/chatbot.interface";
import { Contexts } from "@/domain/enums/contexts.enum";
import { Conversation } from "@/domain/models/conversation";

export class ChatbotEngineService {
  constructor (private readonly getContext: (context: Contexts) => Promise<Context>) {}

  public async execute (input: Input, conversation?: Conversation): Promise<Response> {
    let resultContexts: Response = [];
    const currentContextCode: number = conversation?.context ?? 0;
    const alreadyStarted: boolean = conversation?.isStarted ?? false;
  
    if (alreadyStarted) {
      const currentContext = await this.getContext(currentContextCode);
      const reply = await currentContext.onActivity(input);
      if (reply) {
        resultContexts = resultContexts.concat(reply)
        const foward = reply.find((message: Speak) => !!message['fowardTo']) as Foward
        if (foward) {
          const finishReply = await currentContext.onFinish(input);
          resultContexts = resultContexts.concat(finishReply);
          const nextContext = await this.getContext(foward.fowardTo);
          const initReply = await nextContext.onInit(input);
          resultContexts = resultContexts.concat(initReply);

          // @TODO: tornar recursivo - onInit poderá trocar o contexto n vezes
          const foward2 = initReply.find((message: Speak) => !!message['fowardTo']) as Foward;
          if (foward2) {
            const finishReply = await nextContext.onFinish(input);
            resultContexts = resultContexts.concat(finishReply);
            const nextNextContext = await this.getContext(foward2.fowardTo);
            const initReply = await nextNextContext.onInit(input);
            resultContexts = resultContexts.concat(initReply);

            const foward3 = initReply.find((message: Speak) => !!message['fowardTo']) as Foward;
            if (foward3) {
              const finishReply = await nextContext.onFinish(input);
              resultContexts = resultContexts.concat(finishReply);
              const nextNextContext = await this.getContext(foward3.fowardTo);
              const initReply = await nextNextContext.onInit(input);
              resultContexts = resultContexts.concat(initReply);
            }
          }
        }
      }
    } else {
      const context = await this.getContext(currentContextCode)
      const initReply = await context.onInit(input);
      resultContexts = initReply;
    }

    const response = resultContexts.filter(function (speak: Speak) {
      return speak != null;
    });

    return response.length != 0
      ? response
      : null;
  }
}

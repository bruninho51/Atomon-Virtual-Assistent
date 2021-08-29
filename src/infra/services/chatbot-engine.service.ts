import { Input, Speak, Foward, Response } from "../../domain/contracts/chatbot.interface";
import { getContext } from "../../domain/hooks/get-context.hook";
import { Conversation } from "../../domain/models/conversation";

export class ChatbotEngineService {
  public async execute (input: Input, conversation?: Conversation): Promise<Response> {
    let resultContexts: Response = [];
    const currentContextCode: number = conversation?.context ?? 0;
    const alreadyStarted: boolean = conversation?.isStarted ?? false;
  
    if (alreadyStarted) {
      const currentContext = await getContext(currentContextCode);
      const reply = await currentContext.onActivity(input);
      if (reply) {
        resultContexts = resultContexts.concat(reply)
        const foward = reply.find((message: Speak) => !!message['fowardTo']) as Foward
        if (foward) {
          const finishReply = await currentContext.onFinish();
          resultContexts = resultContexts.concat(finishReply);
          const nextContext = await getContext(foward.fowardTo);
          const initReply = await nextContext.onInit();
          resultContexts = resultContexts.concat(initReply);

          // @TODO: tornar recursivo - onInit poderá trocar o contexto n vezes
          const foward2 = initReply.find((message: Speak) => !!message['fowardTo']) as Foward;
          if (foward2) {
            const finishReply = await nextContext.onFinish();
            resultContexts = resultContexts.concat(finishReply);
            const nextNextContext = await getContext(foward2.fowardTo);
            const initReply = await nextNextContext.onInit();
            resultContexts = resultContexts.concat(initReply);
          }
        }
      }
    } else {
      const context = await getContext(currentContextCode)
      const initReply = await context.onInit();
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

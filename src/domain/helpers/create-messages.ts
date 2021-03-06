import { Response, Speak } from "@/domain/contracts/chatbot.interface"
import { CardType } from "@/domain/enums/card-type.enum"
import { Knowledge } from "@/domain/models/knowledge"

export const createMessages = (message: Speak, ...rest: Speak[]): Response => {
  return [...rest, message]
}

export const createKnowledgeCardMessages = (messages: Speak<Knowledge>[]): Response => {
  return messages.map((message): Speak => ({
    context: message.context,
    delay: message.delay,
    fowardTo: message['fowardTo'],
    message: message.message,
    attachments: message.message.attachments,
    cardType: CardType.knowledge
  }))
}

export const createTrophyCardMessage = (message: Speak<{ value: string }>): Response => {
  return [{
    context: message.context,
    delay: message.delay,
    fowardTo: message['fowardTo'],
    message: message.message,
    cardType: CardType.trophy
  }]
}

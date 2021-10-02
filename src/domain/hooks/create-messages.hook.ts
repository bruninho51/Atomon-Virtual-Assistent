import { Response, Speak } from "../contracts/chatbot.interface"
import { CardType } from "../enums/card-type.enum"
import { Knowledge } from "../models/knowledge"

export const createMessages = (message: Speak, ...rest: Speak[]): Response => {
  return [...rest, message]
}

export const createSimpleCardMessages = (messages: Speak<Knowledge>[]): Response => {
  return messages.map((message): Speak => ({
    context: message.context,
    delay: message.delay,
    fowardTo: message['fowardTo'],
    message: message.message,
    attachments: message.message.attachments,
    cardType: CardType.simple
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

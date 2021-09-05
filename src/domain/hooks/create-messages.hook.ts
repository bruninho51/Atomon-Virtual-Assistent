import { Response, Speak } from "../contracts/chatbot.interface"
import { CardType } from "../enums/card-type.enum"
import { SimpleCard } from "../models/simple-card-message"

export const createMessages = (message: Speak, ...rest: Speak[]): Response => {
  return [...rest, message]
}

export const createSimpleCardMessages = (messages: Speak<SimpleCard>[]): Response => {
  return messages.map((message): Speak => ({
    context: message.context,
    delay: message.delay,
    fowardTo: message['fowardTo'],
    message: message.message,
    attachments: message.message.attachments,
    cardType: CardType.simple
  }))
}

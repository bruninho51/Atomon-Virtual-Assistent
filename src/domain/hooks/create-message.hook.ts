import { Response, Speak } from "../contracts/chatbot.interface"
import { CardType } from "../enums/card-type.enum"
import { SimpleCard } from "../models/simple-card-message"

export const createMessage = (message: Speak): Response => {
  return [message]
}

export const createSimpleCardMessage = (message: Speak<SimpleCard>): Response => {
  return [{ ...message, cardType: CardType.simple }]
}

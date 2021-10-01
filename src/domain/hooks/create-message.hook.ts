import { Response, Speak } from "../contracts/chatbot.interface"
import { CardType } from "../enums/card-type.enum"
import { Knowledge } from "../models/knowledge"

export const createMessage = (message: Speak): Response => {
  return [message]
}

export const createSimpleCardMessage = (message: Speak<Knowledge>): Response => {
  return [{ ...message, cardType: CardType.simple }]
}

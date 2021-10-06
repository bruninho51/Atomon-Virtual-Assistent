import { Response, Speak } from "@/domain/contracts/chatbot.interface"
import { CardType } from "@/domain/enums/card-type.enum"
import { Knowledge } from "@/domain/models/knowledge"

export const createMessage = (message: Speak): Response => {
  return [message]
}

export const createKnowledgeCardMessage = (message: Speak<Knowledge>): Response => {
  return [{ ...message, cardType: CardType.knowledge }]
}

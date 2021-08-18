import { Response, Speak } from "../contracts/chatbot.interface"

export const createMessage = (message: Speak): Response => {
  return [message]
}

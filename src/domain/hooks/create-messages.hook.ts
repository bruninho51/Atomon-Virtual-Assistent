import { Response, Speak } from "../contracts/chatbot.interface"

export const createMessages = (message: Speak, ...rest: Speak[]): Response => {
  return [...rest, message]
}

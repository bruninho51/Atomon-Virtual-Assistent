import { ChatbotEngineService } from "../../../infra/services/chatbot-engine.service";

export const makeChatbotEngineService = (): Promise<ChatbotEngineService> => {
  const chatbot = new ChatbotEngineService()
  return Promise.resolve(chatbot)
}

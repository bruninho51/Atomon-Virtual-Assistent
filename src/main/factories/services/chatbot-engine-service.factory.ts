import { ChatbotEngineService } from "@/infra/services/chatbot-engine.service";
import { getContext } from "@/main/factories/contexts/get-context";

export const makeChatbotEngineService = (): Promise<ChatbotEngineService> => {
  const chatbot = new ChatbotEngineService(getContext)
  return Promise.resolve(chatbot)
}

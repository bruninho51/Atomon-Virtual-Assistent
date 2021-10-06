import { BotFrameworkCardBuilder } from "@/data/cards/bot-framework-card-builder";
import { MessageReader } from "@/domain/contracts/message-reader.interface";
import { AmqpProvider } from "@/infra/providers/amqp.provider";
import { BotFrameworkProvider } from "@/infra/providers/bot-framework.provider";
import { TeamsAmqpWatcher } from "@/infra/services/queue-wachers/teams-amqp.watcher";
import { makePrismaEmployeeRepository } from "@/main/factories/repositories/prisma-employee-repository.factory";
import { makePrismaTemporaryConversationRepository } from "@/main/factories/repositories/prisma-temporary-conversation-repository.factory";
import { makeChatbotEngineService } from "@/main/factories/services/chatbot-engine-service.factory";

export const makeTeamsAmpqWacher = async (): Promise<MessageReader> => {
  const chatbot = await makeChatbotEngineService()
  const employeeRepository = await makePrismaEmployeeRepository()
  const temporaryConversationRepository = await makePrismaTemporaryConversationRepository()
  const rabbitmq = new AmqpProvider()
  const botFramework = new BotFrameworkProvider()
  const cardBuilder = new BotFrameworkCardBuilder()
  const watcher = new TeamsAmqpWatcher(
    chatbot, 
    rabbitmq, 
    botFramework, 
    employeeRepository, 
    temporaryConversationRepository, 
    cardBuilder)
  return Promise.resolve(watcher)
}

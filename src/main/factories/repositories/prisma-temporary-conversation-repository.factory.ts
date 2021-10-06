import { PrismaTemporaryConversationRepository } from "@/data/repositories/prisma-temporary-conversation.repository";
import { TemporaryConversationRepository } from "@/domain/contracts/temporary_conversation-repository.interface";
import { PrismaProvider } from "@/infra/providers/prisma.provider";

export const makePrismaTemporaryConversationRepository = (): Promise<TemporaryConversationRepository> => {
  const repository = new PrismaTemporaryConversationRepository(new PrismaProvider())
  return Promise.resolve(repository)
}

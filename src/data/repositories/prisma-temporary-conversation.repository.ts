import { PrismaProvider } from "@/infra/providers/prisma.provider"
import { TemporaryConversation } from "@/domain/models/conversation"
import { TemporaryConversationRepository } from "@/domain/contracts/temporary_conversation-repository.interface"

export class PrismaTemporaryConversationRepository implements TemporaryConversationRepository {
  constructor (private readonly prismaProvider: PrismaProvider) {}
  async saveConversations (conversations: TemporaryConversation[]): Promise<TemporaryConversation[]> {
    const resultConversations: TemporaryConversation[] = []
    for (const conversation of conversations) {
      const resultConversation = await this.saveConversation(conversation)
      resultConversations.push(resultConversation)
    }
    return resultConversations
  }

  async saveConversation (conversation: TemporaryConversation): Promise<TemporaryConversation> {
    const prisma = await this.prismaProvider.getConnection()

    return await prisma.temporaryConversation.create({
      data: {
        answer: conversation.answer,
        context: conversation.context,
        type: conversation.type,
        isStarted: conversation.isStarted ?? false,
        from: conversation.from,
        typedText: conversation.typedText,
        intent: 'login',
      }  
    })
  }

  async getLastConversationFrom (from: string): Promise<TemporaryConversation> {
    const prisma = await this.prismaProvider.getConnection()

    try {
      return await prisma.temporaryConversation.findFirst({
        where: {
          from
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } catch (error) {
      if (error.name !== 'NotFound') throw error
    }
    return null
  }
}

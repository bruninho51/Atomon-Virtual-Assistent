import { TemporaryConversation } from "@/domain/models/conversation";

export interface TemporaryConversationRepository {
  getLastConversationFrom: (from: string) => Promise<TemporaryConversation>
  saveConversation: (conversation: TemporaryConversation) => Promise<TemporaryConversation>
  saveConversations: (conversations: TemporaryConversation[]) => Promise<TemporaryConversation[]>
}

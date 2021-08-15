import { TemporaryConversation } from "../models/conversation";

export class TemporaryConversationRepository {
  getLastConversationFrom: (from: string) => Promise<TemporaryConversation>
  saveConversation: (conversation: TemporaryConversation) => Promise<TemporaryConversation>
  saveConversations: (conversations: TemporaryConversation[]) => Promise<TemporaryConversation[]>
}

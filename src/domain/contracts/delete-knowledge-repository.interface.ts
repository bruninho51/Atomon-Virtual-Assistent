export interface DeleteKnowledgeRepository {
    delete: (knowledgeId: string) => Promise<void>
}
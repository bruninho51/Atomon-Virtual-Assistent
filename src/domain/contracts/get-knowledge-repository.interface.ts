import { Knowledge } from "@/domain/models/knowledge";

export interface GetKnowledgeRepository {
    get: (keywords: string[], employeeId?: number) => Promise<Knowledge[]>
}
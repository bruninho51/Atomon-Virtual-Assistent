import { ElasticsearchDeleteKnowledgeRepository } from "@/data/repositories/elasticsearch-delete-knowledge.repository";
import { DeleteKnowledgeRepository } from "@/domain/contracts/delete-knowledge-repository.interface";
import { makePrismaEmployeeRepository } from "./prisma-employee-repository.factory";

export const makeElasticsearchDeleteKnowledgeRepository = async (): Promise<DeleteKnowledgeRepository> => {
  const employeeRepository = await makePrismaEmployeeRepository()
  const repository = new ElasticsearchDeleteKnowledgeRepository(employeeRepository)
  return Promise.resolve(repository)
}
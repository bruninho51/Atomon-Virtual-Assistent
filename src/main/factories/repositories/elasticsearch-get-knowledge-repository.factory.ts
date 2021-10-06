import { ElasticsearchGetKnowledgeRepository } from "@/data/repositories/elasticsearch-get-knowledge.repository";
import { GetKnowledgeRepository } from "@/domain/contracts/get-knowledge-repository.interface";
import { makePrismaEmployeeRepository } from "@/main/factories/repositories/prisma-employee-repository.factory";

export const makeElasticsearchGetKnowledgeRepository = async (): Promise<GetKnowledgeRepository> => {
  const employeeRepository = await makePrismaEmployeeRepository()
  const repository = new ElasticsearchGetKnowledgeRepository(employeeRepository)
  return Promise.resolve(repository)
}
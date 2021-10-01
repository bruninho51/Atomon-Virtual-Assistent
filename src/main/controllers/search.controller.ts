import express from "express";
import { Knowledge } from "../../domain/models/knowledge";
import { isInt } from "../../helpers/is-int";
import { makeElasticsearchGetKnowledgeRepository } from "../factories/repositories/elasticsearch-get-knowledge-repository.factory";
import { makeLUISKeywordRepository } from "../factories/repositories/luis-keyword-repository.factory";
import { makePrismaEmployeeRepository } from "../factories/repositories/prisma-employee-repository.factory";

export default async (req: express.Request, res: express.Response): Promise<express.Response | void> => {
  const getKnowledgeRepository = await makeElasticsearchGetKnowledgeRepository()
  const employeeRepository = await makePrismaEmployeeRepository()
  const keywordRepository = await makeLUISKeywordRepository()

  const { sentence, employeeId } = req.query

  if (!isInt(employeeId)) {
    return res.status(400).end('employeeId must be a integer.')
  }

  if (isInt(employeeId)) {
    const employee = await employeeRepository.findById(parseInt(employeeId as unknown as string))
    if (!employee) {
      return res.status(400).end('employee not found.')
    }
  }

  if (!sentence) {
    return res.status(400).end('sentence must be a string.')
  }
  
  const keywords = await keywordRepository.getKeywords(sentence as string)
  const knowledges: Knowledge[] = await getKnowledgeRepository.get(keywords, Number(employeeId))

  res.send(knowledges ?? [])
}
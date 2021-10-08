import express from "express";
import { makeElasticsearchDeleteKnowledgeRepository } from "@/main/factories/repositories/elasticsearch-delete-knowledge-repository.factory";

export default async (req: express.Request, res: express.Response): Promise<express.Response | void> => {
  const repository = await makeElasticsearchDeleteKnowledgeRepository()
  const knowledgeId = req.params.knowledgeId

  if (!knowledgeId) {
    return res.status(400).end('knowledgeId is required.')
  }

  try {
    await repository.delete(knowledgeId)
  } catch (error) {
    if (error.status === 404) {
      return res.status(400).end('knowledge not exists.')
    }
    throw error
  }

  return res.status(200).end()
  
}
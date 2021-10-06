import { LUISKeywordsRepository } from "@/data/repositories/keywords.repository";
import { KeywordsRepository } from "@/domain/contracts/keywords.repository";

export const makeLUISKeywordRepository = (): Promise<KeywordsRepository> => {
  const repository = new LUISKeywordsRepository()
  return Promise.resolve(repository)
}
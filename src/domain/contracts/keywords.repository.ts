export interface KeywordsRepository {
  getKeywords: (phrase: string) => Promise<string[]>
}

export class KeywordsRepository {
  getKeywords: (phrase: string) => Promise<string[]>
}

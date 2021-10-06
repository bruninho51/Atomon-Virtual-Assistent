import { KeywordsRepository } from "@/domain/contracts/keywords.repository";
import { TextAnalyticsClient, AzureKeyCredential } from "@azure/ai-text-analytics";
import { LUIS } from "@/config/config";

export class LUISKeywordsRepository implements KeywordsRepository {
  async getKeywords (phrase: string): Promise<string[]> {
    const client = new TextAnalyticsClient(LUIS.endpoint,  new AzureKeyCredential(LUIS.key));
    const result = await client.extractKeyPhrases([phrase])
    const keywords = result.map((document: any) => { 
      return document.keyPhrases.join(',')
    })
    return keywords
  }
}

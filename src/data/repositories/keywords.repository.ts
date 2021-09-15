import { KeywordsRepository } from "../../domain/contracts/keywords.repository";
import { TextAnalyticsClient, AzureKeyCredential } from "@azure/ai-text-analytics";


export class LUISKeywordsRepository implements KeywordsRepository {
  async getKeywords (phrase: string): Promise<string[]> {
    const client = new TextAnalyticsClient(process.env.LUIS_ENDPOINT,  new AzureKeyCredential(process.env.LUIS_KEY));
    const result = await client.extractKeyPhrases([phrase])
    const keywords = result.map((document: any) => { 
      return document.keyPhrases.join(',')
    })
    return keywords
  }
}
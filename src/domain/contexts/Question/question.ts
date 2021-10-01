import { Context, Response, Input } from '../../contracts/chatbot.interface';
import { Contexts } from '../../enums/contexts.enum';
import { createMessage } from '../../hooks/create-message.hook';
import { createSimpleCardMessages } from '../../hooks/create-messages.hook';
import { Intent } from '../../enums/intent.enum';
import { KeywordsRepository } from '../../contracts/keywords.repository';
import { GetKnowledgeRepository } from '../../contracts/get-knowledge-repository.interface';
import { Knowledge } from '../../models/knowledge';

export class Question implements Context {
  constructor (
    private readonly contextCode: Contexts,
    private readonly keywordsRepository: KeywordsRepository,
    private readonly getKnowledgeRepository: GetKnowledgeRepository,
  ) {}

  getContextCode (): number {
    return this.contextCode
  }

  getIntent (): Intent {
    return Intent.Question
  }

  public async onActivity(input: Input): Promise<Response> {
    const keywords = await this.keywordsRepository.getKeywords(input.text)
    const knowledges: Knowledge[] = await this.getKnowledgeRepository.get(keywords, input.employeeId)

    if (!knowledges) {
      return createMessage({
        context: this,
        message: 'Sinto muito, não sei de nada sobre esse assunto.',
        fowardTo: Contexts.Main,
        delay: 0,
      })
    }

    const messages = []
    for (const knowledge of knowledges) {
      messages.push({
        context: this,
        delay: 0,
        fowardTo: Contexts.Main,
        message: knowledge,
      })
    }
    
    return createSimpleCardMessages(messages)
  }

  public async onInit(): Promise<Response> {
    return createMessage({
      context: this,
      message: 'Sobre o que deseja aprender?',
      delay: 0,
    })
  }

  public async onFinish(): Promise<Response> {
    return createMessage(null)
  }
}

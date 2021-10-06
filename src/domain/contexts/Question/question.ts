import { Context, Response, Input } from '@/domain/contracts/chatbot.interface';
import { Contexts } from '@/domain/enums/contexts.enum';
import { createMessage } from '@/domain/helpers/create-message';
import { createKnowledgeCardMessages } from '@/domain/helpers/create-messages';
import { Intent } from '@/domain/enums/intent.enum';
import { KeywordsRepository } from '@/domain/contracts/keywords.repository';
import { GetKnowledgeRepository } from '@/domain/contracts/get-knowledge-repository.interface';
import { Knowledge } from '@/domain/models/knowledge';

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
    
    return createKnowledgeCardMessages(messages)
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

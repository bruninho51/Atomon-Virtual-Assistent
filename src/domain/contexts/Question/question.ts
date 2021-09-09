import { Context, Response, Input } from '../../contracts/chatbot.interface';
import { Contexts } from '../../enums/contexts.enum';
import { createMessage } from '../../hooks/create-message.hook';
import * as elasticsearch from 'elasticsearch'
import { Elasticsearch } from '../../../config/config';
import { createSimpleCardMessages } from '../../hooks/create-messages.hook';
import { Intent } from '../../enums/intent.enum';
import { EmployeeRepository } from '../../contracts/employee-repository.interface';
import { KeywordsRepository } from '../../contracts/keywords.repository';

export class Question implements Context {
  constructor (
    private readonly contextCode: Contexts,
    private readonly employeeRepository: EmployeeRepository,
    private readonly keywordsRepository: KeywordsRepository,
  ) {}

  getContextCode (): number {
    return this.contextCode
  }

  getIntent (): Intent {
    return Intent.Question
  }

  public async onActivity(_input: Input): Promise<Response> {

    const client = new elasticsearch.Client({
      hosts: [Elasticsearch.url]
    });

    const keywords = await this.keywordsRepository.getKeywords(_input.text)

    const { hits }: any = await client.search({
      index: 'atomon',
      type: 'knowledge',
      body: {
        query: {
          multi_match: {
            query : keywords.join(' '),
            operator: 'and',
            fuzziness: "AUTO",
            analyzer: "atomon_analyzer",
            fields: ["knowledge", "title"]
          },
        }
      }
    })
    
    if (hits.total.value === 0) {
      return createMessage({
        context: this,
        message: 'Sinto muito, não sei de nada sobre esse assunto.',
        fowardTo: Contexts.Main,
        delay: 0,
      })
    }

    const $this = this
    console.dir(hits.hits, { depth: null })

    const messages = []
    for (const hit of hits.hits) {
      messages.push({
        context: $this,
        delay: 0,
        fowardTo: Contexts.Main,
        message: {
          title: hit._source.title,
          body: hit._source.knowledge,
          attachments: await Promise.all(hit._source.attachments?.map(filename => {
          // obter attachment via repositório
            return this.employeeRepository.getAttachmentByFilename(_input.employeeId, filename)
          }) ?? [])
        },
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

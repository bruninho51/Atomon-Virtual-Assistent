import { Context, Response, Input, Foward } from '../../contracts/chatbot.interface';
import { Contexts } from '../../enums/contexts.enum';
import { createMessage } from '../../hooks/create-message.hook';
import * as elasticsearch from 'elasticsearch'
import { Elasticsearch } from '../../../config/config';
import { createSimpleCardMessages } from '../../hooks/create-messages.hook';
import { SimpleCard } from '../../models/simple-card-message';

export class Question implements Context {
  constructor (private readonly contextCode: Contexts) {}
  getContextCode (): number {
    return this.contextCode
  }

  public async onActivity(_input: Input): Promise<Response> {

    const client = new elasticsearch.Client({
      hosts: [Elasticsearch.url]
    });

    const { hits }: any = await client.search({
      index: 'atomon',
      type: 'knowledge',
      body: {
        query: {
          multi_match: {
            query : _input.text,
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
        fowardTo: 1,
        delay: 0,
      })
    }

    const $this = this
    console.dir(hits.hits, { depth: null })
    const messages = hits.hits.map((hit: any): Foward<SimpleCard> => ({
      context: $this,
      delay: 0,
      fowardTo: 1,
      message: {
        title: hit._source.title,
        body: hit._source.knowledge
      },
    }))

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

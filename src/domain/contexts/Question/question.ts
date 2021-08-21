import { Context, Response, Input } from '../../contracts/chatbot.interface';
import { Contexts } from '../../enums/contexts.enum';
import { createMessage } from '../../hooks/create-message.hook';
import * as elasticsearch from 'elasticsearch'
import { Elasticsearch } from '../../../config/config';

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
          match: {
            knowledge: {
              query : _input.text,
              fuzziness: "AUTO"
            }
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
    return hits.hits.map((hit: any) => ({
      context: $this,
      message: `Título: ${hit._source.title} | Conhecimento: ${hit._source.knowledge}`,
      fowardTo: 1,
      delay: 0,
    }))
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

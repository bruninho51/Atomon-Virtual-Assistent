import { Context, Response, Input } from '../../contracts/chatbot.interface';
import { Contexts } from '../../enums/contexts.enum';
import { createMessage } from '../../hooks/create-message.hook';
import axios from 'axios'

export class Question implements Context {
  constructor (private readonly contextCode: Contexts) {}
  getContextCode (): number {
    return this.contextCode
  }

  public async onActivity(input: Input): Promise<Response> {
    
    const { data } = await axios.get(`http://localhost:9200/atomon/_search?q=knowledge:${input.text}`)
    const { hits } = data.hits

    if (data.hits.total.value === 0) {
      return createMessage({
        context: this,
        message: 'Sinto muito, não sei de nada sobre esse assunto.',
        fowardTo: 1,
        delay: 0,
      })
    }

    if (data.error) {
      return createMessage({
        context: this,
        error: new Error(),
        message: 'Humm.. tive um problema ao procurar sobre o assunto. Sinto muito.',
        delay: 0,
      })
    }

    const $this = this
    return hits.map((hit: any) => ({
      context: $this,
      message: `title: ${hit._source.title} | knowledge: ${hit._source.knowledge}`,
      fowardTo: 1,
      delay: 0,
    }))
  }

  public async onInit(): Promise<Response> {
    return createMessage({
      context: this,
      message: 'Qual a sua pergunta?',
      delay: 0,
    })
  }

  public async onFinish(): Promise<Response> {
    return createMessage(null)
  }
}

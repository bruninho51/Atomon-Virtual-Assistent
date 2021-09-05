import { CardType } from "../enums/card-type.enum"
import { Client } from "../enums/client.enum"
import { Attachment } from "../models/attachment"

export type Message<T = unknown> = {
  message: T
  delay: number
  context: Context
  cardType?: CardType
  attachments?: Attachment[]
}

export interface Foward<T = unknown> extends Message<T> {
  fowardTo: number
}

export interface Failure<T = unknown> extends Message<T> {
  error: Error
}

export type Speak<T = unknown> = Message<T> | Foward<T> | Failure<T>

export type Response<T = unknown> = Array<Speak<T>>

export interface Context {
  getContextCode: () => number
  getIntent: () => string
  onActivity: (input: Input) => Promise<Response>
  onInit: (input?: Input) => Promise<Response>
  onFinish: (input?: Input) => Promise<Response>
}

export interface Input {
  text: string
  client: Client
  token: string
  employeeId: number
  attachments: Attachment[]
}

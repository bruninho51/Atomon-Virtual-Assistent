import { Clients } from "../enums/clients.enum"

export type Message = {
  message: string
  delay: number
  context: Context
}

export interface Foward extends Message {
  fowardTo: number
}

export interface Failure extends Message {
  error: Error
}

export type Speak = Message | Foward | Failure

export type Response = Array<Speak>

export interface Context {
  getContextCode: () => number
  onActivity: (input: Input) => Promise<Response>
  onInit: () => Promise<Response>
  onFinish: () => Promise<Response>
}

export interface Input {
  text: string
  client: Clients
  token: string
}

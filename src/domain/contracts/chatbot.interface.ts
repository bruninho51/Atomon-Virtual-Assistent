import { Clients } from "../enums/clients.enum"

export type Message = {
  message: string
  delay: number
}

export interface Foward extends Message {
  context: number
}

export interface Failure extends Message {
  error: Error
}

export type Response = Message | Foward | Failure | null

export interface Context {
  onActivity: (input: Input) => Promise<Response>
  onInit: () => Promise<Message>
  onFinish: () => Promise<Message>
}

export interface Input {
    text: string
    client: Clients
    token: string
}

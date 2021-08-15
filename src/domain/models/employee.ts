import { Conversation } from "./conversation";

export type Employee = {
	id: number
    createdAt: Date
    updatedAt: Date
    name: string
    score: number
    code: number
    conversation: Conversation[]
}
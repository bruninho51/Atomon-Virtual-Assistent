import { Conversation } from "./conversation";
import { Tenant } from "./tenant";

export type Employee = {
	id: number
    createdAt: Date
    updatedAt: Date
    name: string
    score: number
    code: number
    conversation: Conversation[]
    tenant: Tenant
}
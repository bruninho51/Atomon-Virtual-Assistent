import { Conversation } from "./conversation";
import { Level } from "./level";
import { Tenant } from "./tenant";

export type Employee = {
	id: number
    createdAt: Date
    updatedAt: Date
    name: string
    score: number
    code: number
    conversation: Conversation[]
    level: Level
    tenant: Tenant
}
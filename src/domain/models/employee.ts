import { Conversation } from "@/domain/models/conversation";
import { Level } from "@/domain/models/level";
import { Tenant } from "@/domain/models/tenant";

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
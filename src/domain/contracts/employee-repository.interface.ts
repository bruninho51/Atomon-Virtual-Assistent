import { Client } from "../enums/client.enum";
import { Conversation } from "../models/conversation";
import { Employee } from "../models/employee"
import { EmployeeToken } from "../models/employee-token";

export class EmployeeRepository {
  findByCode: (code: number) => Promise<Employee>
  findByToken: (name: Client, token: string) => Promise<Employee>
  saveToken: (employeeId: number, name: Client, token: string) => Promise<EmployeeToken>
  saveConversation: (employeeId: number, conversation: Conversation) => Promise<Employee>
  saveConversations: (employeeId: number, conversations: Conversation[]) => Promise<Employee>
  getLastConversation: (employeeId: number, contextId?: number) => Promise<Conversation>
  findConversationByCursor: (employeeId: number, cursor: number) => Promise<Conversation>
}

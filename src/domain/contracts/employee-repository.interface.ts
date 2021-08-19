import { Clients } from "../enums/clients.enum";
import { Conversation } from "../models/conversation";
import { Employee } from "../models/employee"
import { EmployeeToken } from "../models/employee-token";

export class EmployeeRepository {
  findByCode: (code: number) => Promise<Employee>
  findByToken: (name: Clients, token: string) => Promise<Employee>
  saveToken: (employeeId: number, name: Clients, token: string) => Promise<EmployeeToken>
  saveConversation: (employeeId: number, conversation: Conversation) => Promise<Employee>
  saveConversations: (employeeId: number, conversations: Conversation[]) => Promise<Employee>
  getLastConversation: (employeeId: number) => Promise<Conversation>
  findConversationByCursor: (employeeId: number, cursor: number) => Promise<Conversation>
}

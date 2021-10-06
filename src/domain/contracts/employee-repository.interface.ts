import { Client } from "@/domain/enums/client.enum";
import { Attachment } from "@/domain/models/attachment";
import { Conversation } from "@/domain/models/conversation";
import { Employee } from "@/domain/models/employee"
import { EmployeeToken } from "@/domain/models/employee-token";
import { Level } from "@/domain/models/level";

export interface EmployeeRepository {
  findByCode: (code: number) => Promise<Employee>
  findByToken: (name: Client, token: string) => Promise<Employee>
  saveToken: (employeeId: number, name: Client, token: string) => Promise<EmployeeToken>
  saveConversation: (employeeId: number, conversation: Conversation) => Promise<Employee>
  saveConversations: (employeeId: number, conversations: Conversation[]) => Promise<Employee>
  getLastConversation: (employeeId: number, contextId?: number) => Promise<Conversation>
  findConversationByCursor: (employeeId: number, cursor: number) => Promise<Conversation>
  getLastAttachments: (employeeId: number) => Promise<Attachment[]>
  getAttachmentByFilename: (employeeId: number, filename: string) => Promise<Attachment>
  sumScore: (employeeId: number, score: number) => Promise<Employee>
  findById: (employeeId: number) => Promise<Employee>
  reloadLevel: (employeeId: Employee) => Promise<Level>
}

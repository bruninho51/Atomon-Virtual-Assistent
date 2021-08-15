import { Employee } from "../../domain/models/employee"
import { Clients } from "../../domain/enums/clients.enum"
import { PrismaProvider } from "../../infra/providers/prisma.provider"
import { EmployeeRepository } from "../../domain/contracts/employee-repository.interface"
import { EmployeeToken } from "../../domain/models/employee-token"
import { Conversation } from "../../domain/models/conversation"

export class PrismaEmployeeRepository implements EmployeeRepository {
  constructor (private readonly prismaProvider: PrismaProvider) {}
  async saveConversations (employeeId: number, conversations: Conversation[]): Promise<Employee> {
    let employee: Employee = null
    for (const conversation of conversations) {
      employee = await this.saveConversation(employeeId, conversation)
    }

    return employee
  }

  async saveConversation (employeeId: number, conversation: Conversation): Promise<Employee> {
    const prisma = await this.prismaProvider.getConnection()

    const result = await prisma.conversation.create({
      include: { employee: {
        include: { conversation: true }
      } },
      data: {
        answer: conversation.answer,
        context: conversation.context,
        type: conversation.type,
        isStarted: conversation.isStarted ?? false,
        employeeId
      }
    })
    
    return result.employee
  }

  async getLastConversation (employeeId: number): Promise<Conversation> {
    const prisma = await this.prismaProvider.getConnection()

    try {
      const conversation = await prisma.conversation.findFirst({
        where: {
          employeeId
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return conversation
    } catch (error) {
      if (error.name !== 'NotFound') throw error
    }
    return null
  }

  async findByCode (code: number): Promise<Employee> {
    const prisma = await this.prismaProvider.getConnection()

    try {
      const employee = await prisma.employee.findFirst({
        include: { conversation: true, employeeToken: true },
        where: {
          code: code ? code : 0
        },
      })
      return employee
    } catch (error) {
      if (error.name !== 'NotFound') throw error
    }

    return null
  }

  async saveToken (employeeId: number, name: Clients, token: string): Promise<EmployeeToken> {
    const prisma = await this.prismaProvider.getConnection()
    const employeeToken = await prisma.employeeToken.create({
      data: {
        name,
        token,
        employeeId
      }
    })
    return employeeToken
  }

  async findByToken(name: Clients, token: string): Promise<Employee> {
    const prisma = await this.prismaProvider.getConnection()

    try {
      const employee = await prisma.employee.findFirst({
        include: { conversation: true, employeeToken: true },
        where: {
          employeeToken: {
            some: { token, name }
          }
        },
        orderBy: { createdAt: 'desc' },
      })
      return employee
    } catch (error) {
      if (error.name !== 'NotFound') throw error
    }

    return null
  }
}

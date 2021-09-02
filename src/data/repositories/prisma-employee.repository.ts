import { Employee } from "../../domain/models/employee"
import { Client } from "../../domain/enums/client.enum"
import { PrismaProvider } from "../../infra/providers/prisma.provider"
import { EmployeeRepository } from "../../domain/contracts/employee-repository.interface"
import { EmployeeToken } from "../../domain/models/employee-token"
import { Conversation } from "../../domain/models/conversation"

export class PrismaEmployeeRepository implements EmployeeRepository {
  constructor (private readonly prismaProvider: PrismaProvider) {}
  async findConversationByCursor (employeeId: number, cursor: number): Promise<Conversation> {
    const prisma = await this.prismaProvider.getConnection()

    try {
      const conversation = await prisma.conversation.findFirst({
        where: {
          employeeId
        },
        orderBy: {
          id: 'desc',
        },
        skip: cursor,
        take: 1
      })
      return conversation
    } catch (error) {
      if (error.name !== 'NotFound') throw error
    }
    return null
  }

  async saveConversations (employeeId: number, conversations: Conversation[]): Promise<Employee> {
    let employee: Employee = null
    for (const conversation of conversations) {
      employee = await this.saveConversation(employeeId, conversation)
    }

    return employee
  }

  async saveConversation (employeeId: number, conversation: Conversation): Promise<Employee> {
    const prisma = await this.prismaProvider.getConnection()

    console.log(conversation.attachments)

    const result = await prisma.conversation.create({
      include: { employee: {
        include: { conversation: true }
      } },
      data: {
        answer: conversation.answer,
        context: conversation.context,
        type: conversation.type,
        isStarted: conversation.isStarted ?? false,
        typedText: conversation.typedText,
        employee: {
          connect: {
            id: employeeId
          }
        },
        attachments: {
          create: conversation.attachments?.map((attachment: string) => ({
            filename: attachment
          }))
        }
      }
    })
    
    return result.employee
  }

  async getLastConversation (employeeId: number, contextId?: number): Promise<Conversation> {
    const prisma = await this.prismaProvider.getConnection()

    try {
      const conversation = await prisma.conversation.findFirst({
        where: {
          employeeId,
          context: {
            equals: contextId ?? undefined
          }
        },
        orderBy: {
          id: 'desc',
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

  async saveToken (employeeId: number, name: Client, token: string): Promise<EmployeeToken> {
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

  async findByToken(name: Client, token: string): Promise<Employee> {
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

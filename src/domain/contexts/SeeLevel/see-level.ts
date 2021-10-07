import { Context, Response, Input } from '@/domain/contracts/chatbot.interface';
import { Contexts } from '@/domain/enums/contexts.enum';
import { createMessage } from '@/domain/helpers/create-message';
import { Intent } from '@/domain/enums/intent.enum';
import { EmployeeRepository } from '@/domain/contracts/employee-repository.interface';
import messages from '@/domain/contexts/SeeLevel/messages'

export class SeeLevel implements Context {
  constructor (
    private readonly contextCode: Contexts,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  getContextCode (): number {
    return this.contextCode
  }

  getIntent (): Intent {
    return Intent.SeeLevel
  }

  public async onActivity(_input: Input): Promise<Response> { 
    return null
  }

  public async onInit(input: Input): Promise<Response> {
    const employee = await this.employeeRepository.findById(input.employeeId)
    return createMessage(messages.seeLevel(this, employee.level.name, employee.score))
  }

  public async onFinish(): Promise<Response> {
    return createMessage(null)
  }
}

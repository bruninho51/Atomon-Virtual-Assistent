import { Context, Response, Input } from '@/domain/contracts/chatbot.interface';
import { Contexts } from '@/domain/enums/contexts.enum';
import { createMessage } from '@/domain/helpers/create-message';
import { Intent } from '@/domain/enums/intent.enum';
import { EmployeeRepository } from '@/domain/contracts/employee-repository.interface';
import { createTrophyCardMessage } from '@/domain/helpers/create-messages';
import messages from '@/domain/contexts/LevelUp/messages'

export class LevelUp implements Context {
  constructor (
    private readonly contextCode: Contexts,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  getContextCode (): number {
    return this.contextCode
  }

  getIntent (): Intent {
    return Intent.LevelUp
  }

  public async onActivity(_input: Input): Promise<Response> { 
    return createMessage(null)
  }

  public async onInit(input: Input): Promise<Response> {
    const employee = await this.employeeRepository.findById(input.employeeId)
    return createTrophyCardMessage(messages.onLevelUp(this, employee.level.name))
  }

  public async onFinish(): Promise<Response> {
    return createMessage(null)
  }
}

import { Context, Response, Input } from '@/domain/contracts/chatbot.interface';
import { Contexts } from '@/domain/enums/contexts.enum';
import { createMessage } from '@/domain/helpers/create-message';
import { Intent } from '@/domain/enums/intent.enum';
import { EmployeeRepository } from '@/domain/contracts/employee-repository.interface';
import { createTrophyCardMessage } from '@/domain/helpers/create-messages';

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
    return createMessage({
      context: this,
      message: ':)',
      fowardTo: Contexts.Main,
      delay: 0
    })
  }

  public async onInit(input: Input): Promise<Response> {
    const employee = await this.employeeRepository.findById(input.employeeId)

    return createTrophyCardMessage({
      context: this,
      message: {
        value: `Parabéns! Você subiu de nível e agora é um(a) ${employee.level.name}`
      },
      fowardTo: Contexts.Main,
      delay: 0
    })
  }

  public async onFinish(): Promise<Response> {
    return createMessage(null)
  }
}
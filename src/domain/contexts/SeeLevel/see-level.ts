import { Context, Response, Input } from '../../contracts/chatbot.interface';
import { Contexts } from '../../enums/contexts.enum';
import { createMessage } from '../../hooks/create-message.hook';
import { Intent } from '../../enums/intent.enum';
import { EmployeeRepository } from '../../contracts/employee-repository.interface';

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

    return createMessage({
      context: this,
      message: `Seu nível é ${employee.level.name} e você possui ${employee.score} pontos.`,
      fowardTo: Contexts.Main,
      delay: 0,
    })
  }

  public async onFinish(): Promise<Response> {
    return createMessage(null)
  }
}

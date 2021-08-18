import { Context, Response, Input } from '../../contracts/chatbot.interface';
import { EmployeeRepository } from '../../contracts/employee-repository.interface';
import { Clients } from '../../enums/clients.enum';
import { Contexts } from '../../enums/contexts.enum';
import { createMessage } from '../../hooks/create-message.hook';
import LoginMessages from './messages';

export class Login implements Context {
  constructor (
    private readonly contextCode: Contexts,
    private readonly employeeRepository: EmployeeRepository
  ) {}

  getContextCode (): number {
    return this.contextCode
  }

  public async onActivity(input: Input): Promise<Response> {
    const employee = await this.employeeRepository.findByCode(Number(input.text))
    if (employee) {
      await this.employeeRepository.saveToken(employee.id, Clients.teams, input.token)
      return createMessage({ ...LoginMessages.onActivity.onSuccess, context: this })
    }
    return createMessage({ ...LoginMessages.onActivity.onFailed, context: this })
  }

  public async onInit(): Promise<Response> {
    return createMessage({ ...LoginMessages.onInit, context: this })
  }

  public async onFinish(): Promise<Response> {
    return createMessage({ ...LoginMessages.onFinish, context: this })
  }
}

import { Context, Response, Input } from '@/domain/contracts/chatbot.interface';
import { EmployeeRepository } from '@/domain/contracts/employee-repository.interface';
import { Client } from '@/domain/enums/client.enum';
import { Contexts } from '@/domain/enums/contexts.enum';
import { Intent } from '@/domain/enums/intent.enum';
import { createMessage } from '@/domain/helpers/create-message';
import LoginMessages from './messages';

export class Login implements Context {
  constructor (
    private readonly contextCode: Contexts,
    private readonly employeeRepository: EmployeeRepository
  ) {}

  getIntent (): Intent {
    return Intent.Login
  }

  getContextCode (): number {
    return this.contextCode
  }

  public async onActivity (input: Input): Promise<Response> {
    const employee = await this.employeeRepository.findByCode(Number(input.text))
    if (employee) {
      await this.employeeRepository.saveToken(employee.id, Client.teams, input.token)
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

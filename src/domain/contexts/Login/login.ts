import { Context, Response, Message, Input } from '../../contracts/chatbot.interface';
import { EmployeeRepository } from '../../contracts/employee-repository.interface';
import { Clients } from '../../enums/clients.enum';
import LoginMessages from './messages';

export class Login implements Context {
  constructor (private readonly employeeRepository: EmployeeRepository) {}
  public async onActivity(input: Input): Promise<Response> {
    const employee = await this.employeeRepository.findByCode(Number(input.text))
    if (employee) {
      await this.employeeRepository.saveToken(employee.id, Clients.teams, input.token)
      return LoginMessages.onActivity.onSuccess;
    }
    return LoginMessages.onActivity.onFailed;
  }

  public async onInit(): Promise<Message> {
    return LoginMessages.onInit;
  }

  public async onFinish(): Promise<Message> {
    return LoginMessages.onFinish;
  }
}

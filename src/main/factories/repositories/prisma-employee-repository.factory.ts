import { PrismaEmployeeRepository } from "../../../data/repositories/prisma-employee.repository";
import { EmployeeRepository } from "../../../domain/contracts/employee-repository.interface";
import { PrismaProvider } from "../../../infra/providers/prisma.provider";

export const makePrismaEmployeeRepository = (): Promise<EmployeeRepository> => {
  const repository = new PrismaEmployeeRepository(new PrismaProvider())
  return Promise.resolve(repository)
}
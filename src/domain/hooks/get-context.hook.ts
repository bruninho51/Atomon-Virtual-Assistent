import { Login } from "../contexts/Login/login";
import { Context } from "../contracts/chatbot.interface";
import { Contexts } from "../../domain/enums/contexts.enum";
import { makePrismaEmployeeRepository } from "../../main/factories/repositories/prisma-employee-repository.factory";
import { Main } from "../contexts/Main/main";

export const getContext = async (context: Contexts): Promise<Context> => {
  const contexts = {
    [Contexts.Login]: new Login(await makePrismaEmployeeRepository()),
    [Contexts.Main]: new Main()
  };

  return contexts[context];
};
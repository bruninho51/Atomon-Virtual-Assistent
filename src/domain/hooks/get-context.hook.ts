import { Login } from "../contexts/Login/login";
import { Context } from "../contracts/chatbot.interface";
import { Contexts } from "../../domain/enums/contexts.enum";
import { makePrismaEmployeeRepository } from "../../main/factories/repositories/prisma-employee-repository.factory";
import { Main } from "../contexts/Main/main";
import { Teach } from "../contexts/Teach/teach";
import { Question } from "../contexts/Question/question";

export const getContext = async (context: Contexts): Promise<Context> => {

  const employeeRepository = await makePrismaEmployeeRepository()

  const contexts = {
    [Contexts.Login]: new Login(Contexts.Login, employeeRepository),
    [Contexts.Main]: new Main(Contexts.Main),
    [Contexts.Teach]: new Teach(Contexts.Teach),
    [Contexts.Question]: new Question(Contexts.Question)
  };

  return contexts[context];
};

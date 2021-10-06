import { Login } from "@/domain/contexts/Login/login";
import { Context } from "@/domain/contracts/chatbot.interface";
import { Contexts } from "@/domain/enums/contexts.enum";
import { makePrismaEmployeeRepository } from "@/main/factories/repositories/prisma-employee-repository.factory";
import { Main } from "@/domain/contexts/Main/main";
import { TeachAskTitle } from "@/domain/contexts/Teach/teach-ask-title";
import { Question } from "@/domain/contexts/Question/question";
import { TeachAskKnowledge } from "@/domain/contexts/Teach/teach-ask-knowledge";
import { AskAttachment } from "@/domain/contexts/Teach/ask-attachment";
import { Attachment } from "@/domain/contexts/Teach/attachment";
import { SaveKnowledge } from "@/domain/contexts/Teach/save-knowledge";
import { makeLUISKeywordRepository } from "@/main/factories/repositories/luis-keyword-repository.factory";
import { makeElasticsearchGetKnowledgeRepository } from "@/main/factories/repositories/elasticsearch-get-knowledge-repository.factory";
import { SeeLevel } from "@/domain/contexts/SeeLevel/see-level";
import { LevelUp } from "@/domain/contexts/LevelUp/level-up";

export const getContext = async (context: Contexts): Promise<Context> => {

  const employeeRepository = await makePrismaEmployeeRepository()
  const keywordsRepository = await makeLUISKeywordRepository()
  const getKnowledgeRepository = await makeElasticsearchGetKnowledgeRepository()

  const contexts = {
    [Contexts.Login]: new Login(Contexts.Login, employeeRepository),
    [Contexts.Main]: new Main(Contexts.Main),
    [Contexts.TeachAskTitle]: new TeachAskTitle(Contexts.TeachAskTitle),
    [Contexts.TeachAskKnowledge]: new TeachAskKnowledge(Contexts.TeachAskKnowledge),
    [Contexts.Question]: new Question(Contexts.Question, keywordsRepository, getKnowledgeRepository),
    [Contexts.AskAttachment]: new AskAttachment(Contexts.AskAttachment),
    [Contexts.Attachment]: new Attachment(Contexts.Attachment),
    [Contexts.SaveKnowledge]: new SaveKnowledge(Contexts.SaveKnowledge, employeeRepository),
    [Contexts.ShowLevel]: new SeeLevel(Contexts.ShowLevel, employeeRepository),
    [Contexts.LevelUp]: new LevelUp(Contexts.LevelUp, employeeRepository),
  };

  return contexts[context];
};

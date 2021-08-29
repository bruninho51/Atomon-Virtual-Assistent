import { Failure, Foward, Message } from "../../contracts/chatbot.interface";
import { Contexts } from "../../enums/contexts.enum";

const onTeach: Omit<Foward, 'context'> = {
  message: 'Preciso de algumas informações...',
  fowardTo: Contexts.TeachAskTitle,
  delay: 0
}

const onQuestion: Omit<Foward, 'context'> = {
  message: 'Ok, vamos lá...',
  fowardTo: Contexts.Question,
  delay: 0
}

const onInvalidOption: Omit<Failure, 'context'> = {
  message: 'Opção inválida!',
  delay: 0,
  error: new Error('Opção inválida!')
}

const onInit: Omit<Message, 'context'> = {
  message: 'Você deseja (1 - ensinar) ou (2 - perguntar)?',
  delay: 0 
}

export default {
  onActivity: {
    onTeach,
    onQuestion,
    onInvalidOption
  },
  onInit,
};

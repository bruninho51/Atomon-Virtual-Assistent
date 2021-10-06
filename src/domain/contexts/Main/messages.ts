import { Failure, Foward, Message } from "@/domain/contracts/chatbot.interface";
import { Contexts } from "@/domain/enums/contexts.enum";

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

const onShowLevel: Omit<Foward, 'context'> = {
  message: 'Ok',
  fowardTo: Contexts.ShowLevel,
  delay: 0
}

const onInvalidOption: Array<Omit<Failure, 'context'>> = [{
  message: 'Opção inválida!',
  delay: 0,
  error: new Error('Opção inválida!')
}, {
  message: '<br>Você deseja: <br>1 - Ensinar <br>2 - Perguntar<br>3 - Minha Pontuação<br>Digite o número da opção correspondente',
  delay: 0,
  error: new Error('Opção Inválida!')
}]

const onInit: Omit<Message, 'context'> = {
  message: 'Você deseja: <br>1 - Ensinar <br>2 - Perguntar<br>3 - Minha Pontuação<br>Digite o número da opção correspondente',
  delay: 0 
}

export default {
  onActivity: {
    onTeach,
    onQuestion,
    onInvalidOption,
    onShowLevel
  },
  onInit,
};

import { Context, Failure, Foward, Message } from "@/domain/contracts/chatbot.interface";
import { Contexts } from "@/domain/enums/contexts.enum";
import { getRandomInt } from "@/domain/helpers/random-int";

const onTeach = (context: Context): Foward => {
  const texts = ['Preciso de algumas informações', 'Necessito de alguns dados', 'Necessito de algumas informações']
  return {
    context,
    message: texts[getRandomInt(0, texts.length)],
    fowardTo: Contexts.TeachAskTitle,
    delay: 0
  }
}

const onQuestion = (context: Context): Foward => {
  const texts = ['Ok', 'Vamos nessa', 'Ok, vamos lá...', 'Blz', 'Só um minuto']
  return {
    context,
    message: texts[getRandomInt(0, texts.length)],
    fowardTo: Contexts.Question,
    delay: 0
  }
}

const onShowLevel = (context: Context): Foward => {
  const texts = ['Ok', 'Vamos nessa', 'Ok, vamos lá...', 'Blz', 'Só um minuto']
  return {
    context,
    message: texts[getRandomInt(0, texts.length)],
    fowardTo: Contexts.ShowLevel,
    delay: 0
  }
}

const onInvalidOption = (context: Context): Array<Failure> => {
  const texts = ['Desculpe, não entendi', 'Tente de novo', 'Desconheço essa opção', 'Não compreedi']
  return [{
    context,
    message: texts[getRandomInt(0, texts.length)],
    delay: 0,
    error: new Error('Opção inválida!')
  }, {
    context,
    message: '<br>Você deseja: <br>1 - Ensinar <br>2 - Perguntar<br>3 - Minha Pontuação<br>Digite o número da opção correspondente',
    delay: 0,
    error: new Error('Opção Inválida!')
  }]
}

const onInit = (context: Context): Message => {
  return {
    context,
    message: 'Você deseja: <br>1 - Ensinar <br>2 - Perguntar<br>3 - Minha Pontuação<br>Digite o número da opção correspondente',
    delay: 0
  }
}

export default {
  onTeach,
  onQuestion,
  onInvalidOption,
  onShowLevel,
  onInit,
};

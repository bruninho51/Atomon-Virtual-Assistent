import { Context, Failure, Foward, Message } from "@/domain/contracts/chatbot.interface"
import { Contexts } from "@/domain/enums/contexts.enum"
import { getRandomInt } from "@/domain/helpers/random-int"

const onLinked = (context: Context): Foward => {
  const texts = [
    'Ótimo, estou vinculando sua conta.', 
    'Aguarde. Estou vínculando sua conta.', 
    'Só um minuto',
    'Estou mexendo os pausinhos'
  ]
  return {
    context,
    message: texts[getRandomInt(0, texts.length)],
    fowardTo: Contexts.Main,
    delay: 0
  }
}

const onFailed = (context: Context): Failure => {
  const texts = [
    'Não consegui achar sua conta. Por favor, verifique se ele está correto.',
    'O código digitado é inválido. Por favor, verifique se ele está correto.',
    'Não consegui achar sua conta. Peço que tente novamente.',
    'Não conheço esse código.'
  ]
  return {
    context,
    message: texts[getRandomInt(0, texts.length)],
    error: new Error(),
    delay: 0
  }
}

const onInit = (context: Context): Message => {
  const texts = [
    'Bem vindo a Atomon! Por favor, digite o código do portal, para que eu possa víncular sua conta',
    'Seja bem vindo a Atomon! Por favor, digite seu código',
    'Olá, somos a Atomon! Por gentileza, digite o código da sua conta',
    'Prazer, sou o Atomon. Por favor, me informe o código da sua conta'
  ]
  return {
    context,
    message: texts[getRandomInt(0, texts.length)],
    delay: 0
  }
}

const onFinish = (context: Context): Message => {
  const texts = [
    'Tudo certo. Vamos que vamos :)',
    'Conta vínculada',
    'Maravilha! vínculei sua conta',
    'Tudo certo, agora podemos ser amigos :)'
  ]
  return {
    context,
    message: texts[getRandomInt(0, texts.length)],
    delay: 0
  }
}

export default {
  onLinked,
  onFailed,
  onInit,
  onFinish
};

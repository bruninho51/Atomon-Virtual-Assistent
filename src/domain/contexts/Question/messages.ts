import { Context, Foward, Message } from "@/domain/contracts/chatbot.interface";
import { Contexts } from "@/domain/enums/contexts.enum";
import { getRandomInt } from "@/domain/helpers/random-int";

const onInit = (context: Context): Message => {
  const texts = [
    'Sobre o que deseja aprender?',
    'O que você quer que eu busque?',
    'Digite sobre o assunto que desejas saber'
  ]
  return {
    context,
    message: texts[getRandomInt(0, texts.length)],
    delay: 0
  }
}

const lackKnowledge = (context: Context): Foward => {
  const texts = [
    'Sinto muito, não sei nada sobre esse assunto.',
    'Desculpe, eu não sei a resposta',
    'Não consegui achar sobre o que desejas',
    'Eu não sei sobre isso :(',
    'Fui até o fundo do meu cérebro eletrônico, mas não consegui achar a resposta'
  ]
  return {
    context,
    message: texts[getRandomInt(0, texts.length)],
    fowardTo: Contexts.Main,
    delay: 0,
  }
}

export default {
  onInit,
  lackKnowledge
}
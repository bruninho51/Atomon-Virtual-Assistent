import { Context, Foward } from "@/domain/contracts/chatbot.interface";
import { Contexts } from "@/domain/enums/contexts.enum";
import { getRandomInt } from "@/domain/helpers/random-int"

const onLevelUp = (context: Context, levelName: string): Foward<{ value: string }> => {
  const texts = [
    `Parabéns! Você subiu de nível e agora é um(a) ${levelName}`,
    `Arrasou! Agora você é um(a) ${levelName}`,
    `Meus parabéns! Você acaba de se tornar um(a) ${levelName}`,
    `Você acaba de subir de nível! Sua patente é ${levelName}`
  ]
  return {
    context,
    message: {
      value: texts[getRandomInt(0, texts.length)]
    },
    fowardTo: Contexts.Main,
    delay: 0
  }
}

export default {
  onLevelUp
}
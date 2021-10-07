import { Context, Foward } from "@/domain/contracts/chatbot.interface";
import { Contexts } from "@/domain/enums/contexts.enum";
import { getRandomInt } from "@/domain/helpers/random-int";

export const seeLevel = (context: Context, levelName: string, score: number): Foward => {
  const texts = [
    `Seu nível é ${levelName} e você possui ${score} pontos.`,
    `Você está no nível ${levelName} e possui ${score} pontos.`,
    `Seu ranking é ${levelName} e você possui ${score} pontos.`,
    `Seus pontos somam ${score} e sua patente é ${levelName}.`
  ]
  return {
    context,
    message: texts[getRandomInt(0, texts.length)],
    fowardTo: Contexts.Main,
    delay: 0,
  }
}

export default {
  seeLevel
}
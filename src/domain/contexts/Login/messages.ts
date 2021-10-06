import { Failure, Foward, Message } from "@/domain/contracts/chatbot.interface"
import { Contexts } from "@/domain/enums/contexts.enum"

const onSuccess: Omit<Foward, 'context'> = {
  message: 'Ótimo, estou vinculando sua conta.',
  fowardTo: Contexts.Main,
  delay: 0
}

const onFailed: Omit<Failure, 'context'> = {
  message: 'Não consegui achar sua conta. Por favor, verifique se ele está correto ou gere um novo no portal.',
  error: new Error(),
  delay: 0
}

const onInit: Omit<Message, 'context'> = {
  message: 'Bem vindo a Atomon! Por favor, digite o código de 6 digitos gerado no portal, para que eu possa víncular sua conta do Microsoft Teams.',
  delay: 0
}

const onFinish: Omit<Message, 'context'> = {
  message: 'Blz! Tudo certo. Vamos que vamos :)',
  delay: 0
}

export default {
  onActivity: {
    onSuccess,
    onFailed,
  },
  onInit,
  onFinish
};

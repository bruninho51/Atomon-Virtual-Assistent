export default {
  onActivity: {
    onSuccess: {
      message: 'Ótimo, estou vinculando sua conta.',
      context: 1,
      delay: 0
    },
    onFailed: {
      message: 'Não consegui achar sua conta. Por favor, verifique se ele está correto ou gere um novo no portal.',
      error: new Error(),
      delay: 0
    }
  },
  onInit: {
    message: 'Bem vindo a Atomon! Por favor, digite o código de 6 digitos gerado no portal, para que eu possa víncular sua conta do Microsoft Teams.',
    delay: 0
  },
  onFinish: {
    message: 'Blz! Tudo certo. Vamos que vamos :)',
    delay: 0
  }
};
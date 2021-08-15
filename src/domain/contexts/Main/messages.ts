export default {
  onActivity: {
    onSuccess: {
      message: 'Você Está no menu principal!',
      context: 1,
      delay: 0
    },
    onFailed: {
      message: 'Erro no menu principal!',
      error: new Error(),
      delay: 0
    }
  },
  onInit: {
    message: 'Você acaba de entrar no menu principal!',
    delay: 0
  },
  onFinish: {
    message: 'Você saiu do menu principal!',
    delay: 0
  }
};
  
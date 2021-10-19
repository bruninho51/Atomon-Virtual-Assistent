
import * as dotenv from 'dotenv'

dotenv.config()

export namespace Database {
  export const host = 'localhost'
  export const database = 'atomon'
  export const user = 'root'
  export const password = 'root'
  export const port = '3306'
}

export namespace Server {
  export const port = Number(process.env.PORT || '8000')
  export const isDev = process.env.NODE_ENV === 'development'
  export const domain = process.env.DOMAIN_NAME

  export const acceptedAttachmentFileTypes = [
    '.png','.jpg','.jpeg','.xls','.xlsx','.pdf', '.txt', '.ppt', '.pptx', '.doc', '.docx'
  ]
}

export namespace BotFramework {
  export const botId = process.env.BOT_ID
  export const botPassword = process.env.BOT_PASSWORD
}

export namespace Elasticsearch {
  export const url = process.env.ELASTICSEARCH_URL
}

export namespace S3 {
  export const assets = process.env.BUCKET
  export const icons = `${assets}/icons`
}

export namespace LUIS {
  export const endpoint = process.env.LUIS_ENDPOINT
  export const key = process.env.LUIS_KEY
}

export namespace RabbitMq {
  export const url = process.env.RABBITMQ_URL
  export const teamsChatbotQueue = process.env.MSTEAMS_CHATBOT_QUEUE
}

export default { Database, Server }


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
}

export namespace BotFramework {
  export const botId = process.env.BOT_ID
  export const botPassword = process.env.BOT_PASSWORD
}

export namespace Elasticsearch {
  export const url = process.env.ELASTICSEARCH_URL
}

export namespace RabbitMq {
  export const url = process.env.RABBITMQ_URL
  export const teamsChatbotQueue = process.env.MSTEAMS_CHATBOT_QUEUE
}

export namespace Knex {
  export const config = {
    client: 'mysql',
    connection: {
      host: process.env.DATABASE_HOSTNAME || Database.host,
      database: process.env.DATABASE_NAME || Database.database,
      user: process.env.DATABASE_USERNAME || Database.user,
      password: process.env.DATABASE_PASSWORD || Database.password,
      port: process.env.DATABASE_PORT || Database.port,
    },
  }
}

export default { Database, Server, Knex }

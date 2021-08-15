import * as express from 'express'
import { makeTeamsAmpqWacher } from './main/factories/services/teams-amqp-watcher.factory'
import { RabbitMq, Server } from './config/config'
import * as cuid from 'cuid'
import { Activity, TurnContext } from 'botbuilder'
import { AmqpProvider } from './infra/providers/amqp.provider'

(async function main() {
  const app = express()
  app.use(express.json())

  const watcher = await makeTeamsAmpqWacher()
  watcher.read()

  app.post('/messages', async (req: express.Request, res: express.Response) => {
    const activity = req.body as Activity;
    const conversationReference = TurnContext.getConversationReference(activity);

    const amqp = new AmqpProvider()
    const conn = await amqp.getInstance()
    const channel = await conn.createChannel();
    const queueName = RabbitMq.teamsChatbotQueue;
    try {
      channel.sendToQueue(queueName, Buffer.from(
        JSON.stringify({
          conversationReference,
          activity
        })
      ), {
        appId: 'Atomon',
        messageId: cuid(),
        headers: { queueName }
      });
      return res.end()
    } catch (err) {
      return res.status(500).send(err)
    }
  })

  app.listen(Server.port, () => {
    console.log(`Example app listening at http://localhost:${Server.port}`)
  })
  
})()

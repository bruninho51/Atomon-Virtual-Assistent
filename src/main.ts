import * as express from 'express'
import { makeTeamsAmpqWacher } from './main/factories/services/teams-amqp-watcher.factory'
import { RabbitMq, Server } from './config/config'
import * as cuid from 'cuid'
import { Activity, Attachment, TurnContext } from 'botbuilder'
import { AmqpProvider } from './infra/providers/amqp.provider'
import * as path from 'path'
import { exec } from 'child_process'

(async function main() {
  const app = express()
  app.use(express.json())

  const watcher = await makeTeamsAmpqWacher()
  watcher.read()

  app.get('/', async (_req, res) => res.end('Ok'))

  app.post('/api/messages', async (req: express.Request, res: express.Response) => {
    const activity = req.body as Activity;
    const conversationReference = TurnContext.getConversationReference(activity);

    if (activity.attachments) {
      activity.attachments.forEach((attachment: Attachment) => {
        const filename = `${attachment.content['uniqueId']}.${attachment.content['fileType']}`
        const filepath = path.join(process.cwd(), 'tmp', filename);

        console.log(`curl -o "${filepath}" "${attachment.content['downloadUrl']}"`)
        exec(`curl -o "${filepath}" "${attachment.content['downloadUrl']}"`, (error) => {
          console.log(error)
        })
      })
    }

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

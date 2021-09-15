import * as express from 'express'
import { makeTeamsAmpqWacher } from './main/factories/services/teams-amqp-watcher.factory'
import { RabbitMq, Server } from './config/config'
import * as cuid from 'cuid'
import { Activity, TurnContext } from 'botbuilder'
import { AmqpProvider } from './infra/providers/amqp.provider'
import { BotFrameworkSaveAttachment } from './infra/services/bot-framework-save-attachment'

(async function main() {
  const app = express()
  app.use(express.json())

  app.use('/files', express.static('tmp'))
  app.use('/assets', express.static('assets'))

  const watcher = await makeTeamsAmpqWacher()
  watcher.read()

  app.get('/', async (_req, res) => res.end('Ok'))

  app.post('/api/messages', async (req: express.Request, res: express.Response) => {
    const activity = req.body as Activity;
    const conversationReference = TurnContext.getConversationReference(activity);

    const attachments: any[] = []
    if (activity.attachments) {
      const attachmentSaver = new BotFrameworkSaveAttachment()
      for (const attachment of activity.attachments) {
        attachments.push({
          filename: await attachmentSaver.save(attachment),
          name: attachment.name,
        })
      }
    }

    const amqp = new AmqpProvider()
    const conn = await amqp.getInstance()
    const channel = await conn.createChannel();
    const queueName = RabbitMq.teamsChatbotQueue;
    try {
      channel.sendToQueue(queueName, Buffer.from(
        JSON.stringify({
          conversationReference,
          attachments,
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

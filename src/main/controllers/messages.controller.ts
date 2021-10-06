import { TurnContext } from "botbuilder-core";
import { Activity } from "botframework-schema";
import * as cuid from "cuid";
import express from "express";
import { RabbitMq } from "@/config/config";
import { AmqpProvider } from "@/infra/providers/amqp.provider";
import { BotFrameworkSaveAttachment } from "@/infra/services/bot-framework-save-attachment";

export default async (req: express.Request, res: express.Response): Promise<express.Response | void> => {
  const activity = req.body as Activity;
  const conversationReference = TurnContext.getConversationReference(activity);

  const ignoreAttachments: string[] = ['text/html']

  const attachments: any[] = []
  if (activity.attachments) {
    const attachmentSaver = new BotFrameworkSaveAttachment()
    for (const attachment of activity.attachments) {
      if (!ignoreAttachments.includes(attachment.contentType)) {
        attachments.push({
          filename: await attachmentSaver.save(attachment),
          name: attachment.name,
        })
      }
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
    console.log(err)
    return res.status(500).send(err)
  }
}
import { Attachment } from "botbuilder";
import { Attachment as AttachmentModel } from "../../domain/models/attachment"
import { Message } from "../../domain/contracts/chatbot.interface";
import { Knowledge } from "../../domain/models/knowledge";
import { S3 } from "../../config/config";

export const createSimpleCard = async (message: Message<Knowledge>): Promise<Attachment> => {
  const template = {
    "contentType": "application/vnd.microsoft.card.adaptive",
    "content": {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "version": "1.0",
      "body": [
        {
          "type": "Container",
          "items": [
            {
              "type": "TextBlock",
              "text": message.message?.title,
              "weight": "bolder",
              "size": "medium"
            },
          ]
        },
        {
          "type": "Container",
          "items": [
            {
              "type": "TextBlock",
              "text": message.message?.body,
              "wrap": true
            },
          ]
        },
      ],
      "actions": message.attachments?.map((attach: AttachmentModel) => {
        return {
          "type": "Action.OpenUrl",
          "url": attach.url,
          "iconUrl": `${S3.assets}/icons/${attach.icon}`,
          "title": attach.title
        }
      })
    },
  }

  console.dir(template, { depth: null })

  return template
}

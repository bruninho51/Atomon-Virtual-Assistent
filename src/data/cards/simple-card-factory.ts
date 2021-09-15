import { Attachment } from "botbuilder";
import { Attachment as AttachmentModel } from "../../domain/models/attachment"
import { Message } from "../../domain/contracts/chatbot.interface";
import { SimpleCard } from "../../domain/models/simple-card-message";
import { S3 } from "../../config/config";

export const createSimpleCard = async (message: Message<SimpleCard>): Promise<Attachment> => {
  return {
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
          "iconUrl": `${S3.assets}/${attach.icon}`,
          "title": attach.title
        }
      })
    },
  }
}

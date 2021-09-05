import { Attachment } from "botbuilder";
import { Message } from "../../domain/contracts/chatbot.interface";
import { SimpleCard } from "../../domain/models/simple-card-message";

export const createSimpleCard = async (message: Message<SimpleCard>): Promise<Attachment> => {
  console.log('attachments: ', message.attachments)
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
        }
      ],
    }
  }
}

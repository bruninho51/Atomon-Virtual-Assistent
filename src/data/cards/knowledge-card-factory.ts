import { Attachment } from "botbuilder";
import { Attachment as AttachmentModel } from "@/domain/models/attachment"
import { Message } from "@/domain/contracts/chatbot.interface";
import { Knowledge } from "@/domain/models/knowledge";
import { S3 } from "@/config/config";

export const createKnowledgeCard = async (message: Message<Knowledge>): Promise<Attachment> => {

  const dt = message.message.createdAt
  const d = dt?.getDate().toString().padStart(2, '0')
  const m = (dt?.getMonth() + 1).toString().padStart(2, '0')
  const y = dt?.getFullYear()
  const hor = dt?.getHours().toString().padStart(2, '0')
  const min = dt?.getMinutes().toString().padStart(2, '0')

  const createdAt: string = dt ? `${d}/${m}/${y} ${hor}:${min}` : null

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
              "size": "large"
            },
            {
              "type": "ColumnSet",
              "columns": [
                {
                  "type": "Column",
                  "width": "stretch",
                  "items": [
                    {
                      "type": "TextBlock",
                      "text": `Enviado por ${message.message.employeeName} - Nível ${message.message.levelName}`,
                      "weight": "bolder",
                      "wrap": true
                    },
                    {
                      "type": "TextBlock",
                      "spacing": "none",
                      "text": message.message.createdAt 
                        ? `Criado em: ${createdAt}`
                        : null,
                      "isSubtle": true,
                      "wrap": true
                    }
                  ]
                }
              ]
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
          "iconUrl": `${S3.assets}/icons/attachment.png`,
          "title": attach.title,
        }
      })
    },
  }
  
  return template
}

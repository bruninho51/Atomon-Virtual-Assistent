import { Attachment } from "botbuilder";
import { Attachment as AttachmentModel } from "../../domain/models/attachment"
import { Message } from "../../domain/contracts/chatbot.interface";
import { SimpleCard } from "../../domain/models/simple-card-message";

export const createSimpleCard = async (message: Message<SimpleCard>): Promise<Attachment> => {

  // TODO: Transformar message.attachments em um array de AttachmentModel
  /*const attachs = message.attachments?.map((attachment: string): AttachmentModel => {
    return {
      title: attachment,
      path: `http://localhost:3333/${attachment}`,
      mimetype: 'unknown',
      icon: "https://findicons.com/files/icons/2795/office_2013_hd/128/excel.png"
    }
  })*/

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
      "actions": message.attachments?.map((attach: AttachmentModel) => ({
        "type": "Action.OpenUrl",
        "url": attach.url,
        "iconUrl": "https://findicons.com/files/icons/2795/office_2013_hd/128/excel.png", 
        "title": attach.title
      }))
    },
  }
}

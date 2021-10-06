import { Attachment } from "botbuilder"
import { Message } from "@/domain/contracts/chatbot.interface"

export const createTrophyCard = async (message: Message<{ value: string }>): Promise<Attachment> => {
  const template = {
    "contentType": "application/vnd.microsoft.card.adaptive",
    "content": {  
      "$schema":"http://adaptivecards.io/schemas/adaptive-card.json",
      "type":"AdaptiveCard",
      "version":"1.1",
      "backgroundImage": {
        "url": "https://mysignature.io/blog/wp-content/uploads/2018/02/trophy-banner.jpg",
        "fillMode": "cover",
        "horizontalAlignment": "left",
        "VerticalAlignment ": "center"
      },
      "body":[  
        {  
          "type":"ColumnSet",
          "columns":[  
            {  
              "type":"Column",
              "minHeight": "10px",
              "items": []
            }
          ]
        },
        {  
          "type":"ColumnSet",
          "columns":[  
            {  
              "type":"Column",
              "width": "5px",
              "items":[]
            },
            {  
              "type":"Column",
              "minHeight": "80px",
              "width": "200px",
              "items":[  
                {  
                  "type":"TextBlock",
                  "spacing":"small",
                  "horizontalAlignment": "Center",
                  "verticalContentAlignment": "Center",
                  "size":"default",
                  "text": message.message.value,
                  "wrap":true,
                  "maxLines":0,
                  "seperator":true,
                  "FontWeight": 'bolder'
                }
              ]
            }
          ]
        }
      ]
    }
  }

  return template
}
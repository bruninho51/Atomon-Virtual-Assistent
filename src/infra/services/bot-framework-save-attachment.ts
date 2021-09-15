import { Attachment } from "botbuilder";
import * as path from 'path'
import { exec } from 'child_process'

export class BotFrameworkSaveAttachment {
  async save(attachment: Attachment): Promise<string> {
    const filename = `${attachment.content['uniqueId']}.${attachment.content['fileType']}`
    const filepath = path.join(process.cwd(), 'tmp', filename);

    exec(`curl -o "${filepath}" "${attachment.content['downloadUrl']}"`, (error) => {
      console.log(error)
    })

    return filename
  }
}
import { Attachment } from "botbuilder";
import * as path from 'path'
import { exec } from 'child_process'
import * as cuid from 'cuid'
import { extname } from 'path'

export class BotFrameworkSaveAttachment {
  async save(attachment: Attachment): Promise<string> {
    console.dir(attachment, { depth: null })

    // microsoft teams
    if (attachment.content) {
      const filename = `${attachment.content['uniqueId']}.${attachment.content['fileType']}`
      const filepath = path.join(process.cwd(), 'tmp', filename);
  
      exec(`curl -o "${filepath}" "${attachment.content['downloadUrl']}"`, (error) => {
        if (error) {
          console.log(error)
        } 
      })

      return filename
    }
    
    // bot framework emulator
    const filename = `${cuid()}.${extname(attachment.name).replace('.', '')}`
    const filepath = path.join(process.cwd(), 'tmp', filename);
    exec(`curl -o "${filepath}" "${attachment.contentUrl}"`, (error) => {
      if (error) {
        console.log(error)
      } 
    })

    return filename
  }
}
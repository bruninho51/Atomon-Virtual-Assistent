import { Attachment } from "./attachment";

export type SimpleCard = {
  title: string
  body: string
  attachments: Attachment[]
}

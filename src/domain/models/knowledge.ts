import { Attachment } from "./attachment";

export type Knowledge = {
  title: string
  body: string
  employeeId: number
  attachments: Attachment[]
}

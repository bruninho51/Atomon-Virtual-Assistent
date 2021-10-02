import { Attachment } from "./attachment";

export type Knowledge = {
  title: string
  body: string
  employeeId: number
  employeeName: string
  levelName: string
  createdAt: Date
  attachments: Attachment[]
}

import { Attachment } from "@/domain/models/attachment";

export type Knowledge = {
  id: string
  title: string
  body: string
  employeeId: number
  employeeName: string
  levelName: string
  createdAt: Date
  attachments: Attachment[]
}

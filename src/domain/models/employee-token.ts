import { Employee } from "@/domain/models/employee";

export type EmployeeToken = {
	id: number
    createdAt: Date
    updatedAt: Date
    name: string
    token: string
    employee?: Employee
}
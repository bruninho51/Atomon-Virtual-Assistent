import { Employee } from "./employee";

export type EmployeeToken = {
	id: number
    createdAt: Date
    updatedAt: Date
    name: string
    token: string
    employee?: Employee
}
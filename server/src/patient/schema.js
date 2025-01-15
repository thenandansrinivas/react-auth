import { z } from 'zod'

const Patient = z.object({
	name: z.string(),
	dob: z.string().optional(),
	age: z.number().optional(),
	gender: z.enum(['male', 'female']),
	clinic: z.string(),
	phone: z.string()
})

const createPatientSchema = Patient
const updatePatientSchema = Patient.partial()

export { createPatientSchema, updatePatientSchema }

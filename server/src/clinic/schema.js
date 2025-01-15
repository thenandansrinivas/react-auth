import { z } from 'zod'

const Clinic = z.object({
	name: z.string().min(3).max(50),
	address: z.string().min(3).max(50),
	phone: z.string().min(10).max(10),
	mail: z.string().email().optional()
})

export const createNewClinicSchema = Clinic
export const updateClinicSchema = Clinic.partial()
export const searchQuerySchema = z
	.object({
		name: z.string().optional(),
		address: z.string().optional(),
		phone: z.string().optional(),
		mail: z.string().optional(),
		page: z
			.string()
			.transform(val => parseInt(val) || 1)
			.optional(),
		limit: z
			.string()
			.transform(val => parseInt(val) || 5)
			.optional(),
		sortField: z.enum(['name', 'mail', 'address', 'phone']).optional(),
		sortOrder: z.enum(['asc', 'desc']).optional()
	})
	.partial()

import { z } from 'zod'

export const appSchemma = z.object({
	name: z.string().min(1, 'Name is required'),
	phone: z.string().min(10, 'Phone number must be 10 digits'),
	mail: z.string().email('Please enter a valid email'),
	website: z.string().optional(),
	address: z.string().optional()
})

export const updateAppSchema = appSchemma.partial()

import { z } from 'zod'

const parseTrayInput = input => {
	const numbers = new Set()

	const parts = input.split(',').map(part => part.trim())

	for (const part of parts) {
		if (part.includes('-')) {
			const [start, end] = part.split('-').map(num => parseInt(num.trim()))

			// Validate the numbers
			if (isNaN(start) || isNaN(end)) {
				throw new Error(`Invalid range format: ${part}`)
			}

			// Remove upper limit restriction and allow reverse ranges
			const min = Math.min(start, end)
			const max = Math.max(start, end)

			for (let i = min; i <= max; i++) {
				numbers.add(i)
			}
		} else {
			const num = parseInt(part)
			if (isNaN(num)) {
				throw new Error(`Invalid number: ${part}`)
			}
			numbers.add(num)
		}
	}

	return Array.from(numbers).sort((a, b) => a - b)
}

export const trayInputSchema = z
	.string()
	.refine(
		val => {
			try {
				const numbers = parseTrayInput(val)
				return numbers.every(num => num >= 0)
			} catch {
				return false
			}
		},
		{
			message:
				"Invalid tray format. Use single numbers (e.g., '1'), comma-separated numbers (e.g., '1,2,3'), or ranges (e.g., '1-5')"
		}
	)
	.transform(parseTrayInput)

export const CreateRecordSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	gender: z.enum(['male', 'female']),
	phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
	age: z.number().optional(),
	dob: z.string(),
	clinic: z.string(),
	trays: trayInputSchema
})

export const updateTrayStatusSchema = z.object({
	field: z.enum(['Scaling', 'Processing', 'Dispatched', 'Delivered']),
	status: z.boolean(),
	remarks: z.string().optional()
})

export const updateRecordTrayStatusSchema = z.object({
	type: z.string(),
	status: z.boolean()
})

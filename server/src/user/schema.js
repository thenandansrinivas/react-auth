import { z } from 'zod'

const userSchema = z.object({
	name: z
		.string()
		.min(3)
		.max(50)
		.transform(val => val.toLowerCase()),
	phone: z.string().min(10).max(10),
	email: z
		.string()
		.trim()
		.min(1, 'Email is required')
		.max(100, 'Email is too long')
		.email('Invalid email')
		.transform(val => val.toLowerCase()),
	gender: z.enum(['male', 'female', 'other']),
	roles: z
		.array(z.enum(['admin', 'dev', 'moderator', 'doctor']))
		.nonempty({ message: 'Role is required' })
		.transform(roles => roles.map(role => role.toLowerCase()))
		.superRefine((roles, ctx) => {
			const duplicates = roles.filter((role, index) => roles.indexOf(role) !== index)
			if (duplicates.length > 0) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: `Duplicate role(s) found: ${[...new Set(duplicates)].join(', ')}`
				})
			}
		})
})

export const createAccountSchema = userSchema
export const searchParamSchema = userSchema
	.omit({ roles: true })
	.extend({
		id: z.string().max(6).min(6),
		roles: z.enum(['admin', 'dev', 'moderator', 'doctor'])
	})
	.partial()
export const updateAccountSchema = userSchema.partial()

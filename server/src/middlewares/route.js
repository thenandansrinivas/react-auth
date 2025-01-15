import createError from 'http-errors'
import { verifyAccessToken } from '../utils/jwt.js'

export const Authenticate = (req, res, next) => {
	const { access } = req.cookies
	if (!access) {
		const error = new createError.Unauthorized('Access token missing')
		error.name = 'InvalidAccessToken'
		throw error
	}
	try {
		const payload = verifyAccessToken(access)
		req.user = payload
		next()
	} catch (error) {
		error.status = 401
		error.name = 'InvalidAccessToken'
		next(error)
	}
}

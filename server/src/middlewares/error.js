import config from '../config/env.js'

const { ENV } = config

export const asyncErrorHandler = fn => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next)
}

export const globalErrorHandler = (err, req, res, next) => {
	const status = err.status || 500
	const message = err.message || 'Something went wrong'
	const stack = ENV === 'dev' && err?.stack

	const errMsg = {
		status,
		message,
		stack
	}

	if (err.name === 'CastError') {
		errMsg.message = 'Invalid ID format'
		errMsg.status = 400
	}

	if (err.name === 'ZodError') {
		errMsg.message = 'Validation failed'
		errMsg.errors = err.errors.map(e => ({
			field: e.path.join('.'),
			message: e.message
		}))
		errMsg.status = 400
	}

	if (err.name === 'MongoServerError' && err.code === 11000) {
		errMsg.message = 'Record alredy exists'
		errMsg.errors = err.errorResponse.keyValue
		errMsg.status = 400
	}

	res.status(errMsg.status).json(errMsg)
}

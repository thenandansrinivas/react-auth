import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import createError from 'http-errors'
import morgan from 'morgan'
import _ from 'lodash'

import config from './config/env.js'
import { globalErrorHandler, asyncErrorHandler } from './middlewares/error.js'
import api from './router.js'

const { ORIGIN, SECRET_COOKIE } = config

const app = express()

const allowedOrigins = ORIGIN.split(',').map(i => i.trim())

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true)
			} else {
				callback(new Error('Not allowed by CORS'))
			}
		},
		credentials: true
	})
)
app.use(morgan('dev'))
app.use(cookieParser(SECRET_COOKIE))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get(
	'/v1/health',
	asyncErrorHandler(async (req, res, next) => {
		res.status(200).send({
			message: 'Bits and bytes at your service'
		})
	})
)

app.use('/v1', api)

app.use((req, res, next) => {
	next(createError.NotFound())
})
app.use(globalErrorHandler)
export default app

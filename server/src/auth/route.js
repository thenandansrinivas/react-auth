import { Router } from 'express'
import { asyncErrorHandler } from '../middlewares/error.js'
import { login, logout, refresh, me } from './controller.js'
import { Authenticate } from '../middlewares/route.js'

const Auth = Router()

Auth.post('/login', asyncErrorHandler(login))
Auth.get('/refresh', asyncErrorHandler(refresh))
Auth.get('/logout', asyncErrorHandler(logout))
Auth.get('/me', Authenticate, asyncErrorHandler(me))

export default Auth

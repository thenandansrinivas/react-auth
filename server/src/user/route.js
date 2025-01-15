import { Router } from 'express'
import { asyncErrorHandler } from '../middlewares/error.js'
import { create, update, display, remove } from './controller.js'

const User = Router()

User.get('/', asyncErrorHandler(display))
User.post('/', asyncErrorHandler(create))
User.patch('/:id', asyncErrorHandler(update))
User.delete('/:id', asyncErrorHandler(remove))

export default User

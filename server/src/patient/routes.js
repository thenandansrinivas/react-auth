import { Router } from 'express'
import { asyncErrorHandler } from '../middlewares/error.js'
import { create, update, display, displayById, remove } from './controller.js'
const Patient = Router()

Patient.get('/', asyncErrorHandler(display))
Patient.get('/:id', asyncErrorHandler(displayById))
Patient.delete('/:id', asyncErrorHandler(remove))
Patient.patch('/:id', asyncErrorHandler(update))
Patient.post('/', asyncErrorHandler(create))

export default Patient

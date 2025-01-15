import { Router } from 'express'
import { create, update, remove, display, displayById, removeBulk, DisplayClinicNames } from './controller.js'
import { asyncErrorHandler } from '../middlewares/error.js'

const Clinic = Router()

Clinic.post('/', asyncErrorHandler(create))
Clinic.patch('/:id', asyncErrorHandler(update))
Clinic.delete('/:id', asyncErrorHandler(remove))
Clinic.delete('/', asyncErrorHandler(removeBulk))
Clinic.get('/names', asyncErrorHandler(DisplayClinicNames))
Clinic.get('/:id', asyncErrorHandler(displayById))
Clinic.get('/', asyncErrorHandler(display))

export default Clinic

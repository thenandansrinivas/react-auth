import { Router } from 'express'
import { asyncErrorHandler } from '../middlewares/error.js'
import {
	check,
	create,
	display,
	updateTrayStatus,
	updateTrayTypeStatus,
	recordComplete,
	remove,
	removeTray,
	addTray,
	removeTrayType,
	displayLogs,
	report
} from './controller.js'

const Record = Router()

Record.get('/', asyncErrorHandler(display))
Record.post('/', asyncErrorHandler(create))
Record.post('/check', asyncErrorHandler(check))
Record.patch('/:rid/complete', asyncErrorHandler(recordComplete))
Record.patch('/:rid/tray', asyncErrorHandler(addTray))
Record.delete('/:rid/tray/:tid', asyncErrorHandler(removeTray))
Record.patch('/:rid/tray/:tid/status', asyncErrorHandler(updateTrayStatus))
Record.delete('/:rid/tray/:tid/type/:typeid', asyncErrorHandler(removeTrayType))
Record.patch('/:rid/tray/:tid/type/status', asyncErrorHandler(updateTrayTypeStatus))
Record.post('/:rid/logs', asyncErrorHandler(displayLogs))
Record.delete('/:rid', asyncErrorHandler(remove))
Record.post('/report', asyncErrorHandler(report))

export default Record

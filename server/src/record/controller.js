import {
	chechPatientFn,
	createNewRecord,
	displayRecords,
	updateTrayStatusFn,
	updateTrayTypeStatusFn,
	completeRecordFn,
	deleteRecord,
	addNewTrayToRecord,
	removeTrayFn,
	deleteTrayTypeFn,
	displayLogsFn,
	generateLogReport
} from './service.js'
import { CreateRecordSchema, trayInputSchema } from './schema.js'
import { format } from 'date-fns'

export const display = async (req, res, next) => {
	const data = await displayRecords()
	res.send(data)
}

export const check = async (req, res, next) => {
	const data = CreateRecordSchema.parse(req.body)
	await chechPatientFn(data).then(() => {
		res.sendStatus(200)
	})
}
export const create = async (req, res, next) => {
	const request = CreateRecordSchema.parse(req.body)
	const data = createNewRecord(request)
	res.send(data)
}

export const updateTrayStatus = async (req, res, next) => {
	const { rid, tid } = req.params
	const { field, status, remarks } = req.body
	const data = await updateTrayStatusFn({ rid, tid, field, status, remarks })
	res.send(data)
}

export const updateTrayTypeStatus = async (req, res, next) => {
	const { rid, tid } = req.params
	const { type, status } = req.body
	const data = await updateTrayTypeStatusFn({ rid, tid, type, status })
	res.send(data)
}

export const recordComplete = async (req, res, next) => {
	const { rid } = req.params
	const { status } = req.body
	const data = await completeRecordFn({ rid, status })
	res.send(data)
}

export const remove = async (req, res, next) => {
	const { rid } = req.params
	const data = await deleteRecord(rid)
	res.send(data)
}

export const addTray = async (req, res, next) => {
	const { rid } = req.params
	const { num } = req.body
	const tray = trayInputSchema.parse(num)
	const data = await addNewTrayToRecord({ rid, tray })
	res.send(data)
}

export const removeTray = async (req, res, next) => {
	const { rid, tid } = req.params
	const data = await removeTrayFn({ rid, tid })
	res.send(data)
}

export const removeTrayType = async (req, res, next) => {
	const { rid, tid, typeid } = req.params
	const data = await deleteTrayTypeFn({ rid, tid, typeid })
	res.send(data)
}

export const displayLogs = async (req, res, next) => {
	const { rid } = req.params
	const data = await displayLogsFn(rid)
	res.send(data)
}

export const report = async (req, res, next) => {
	const { content, patientName, patientDetails } = req.body
	const data = await generateLogReport(content)
	res.setHeader('Content-Type', 'application/pdf')
	res.setHeader(
		'Content-Disposition',
		`attachment; filename="${patientName}-${patientDetails.phone}-${format(new Date(), 'yyyy-MM-dd HH:mm')}-TimeLine.pdf"`
	)
	res.end(data)
}

import {
	saveNewClinic,
	deleteClinicById,
	displayClinicById,
	updateClinicById,
	searchClinicByQuery,
	deleteBulkClinic,
	displayClinicNames
} from './service.js'
import { createNewClinicSchema, updateClinicSchema, searchQuerySchema } from './schema.js'
export const create = async (req, res, next) => {
	const request = createNewClinicSchema.parse(req.body)
	const newClinic = await saveNewClinic(request)
	res.status(201).json(newClinic)
}

export const remove = async (req, res, next) => {
	const { id } = req.params
	await deleteClinicById(id).then(() => res.sendStatus(200))
}

export const update = async (req, res, next) => {
	const { id } = req.params
	const request = updateClinicSchema.parse(req.body)
	const data = await updateClinicById(id, request)
	res.status(200).json(data)
}

export const displayById = async (req, res, next) => {
	const { id } = req.params
	const updatedClinic = await displayClinicById(id)
	res.status(200).json(updatedClinic)
}

export const display = async (req, res, next) => {
	const query = searchQuerySchema.parse(req.query)
	const data = await searchClinicByQuery(query)
	res.status(200).json(data)
}

export const removeBulk = async (req, res, next) => {
	const { ids } = req.body
	await deleteBulkClinic(ids)
	res.sendStatus(200)
}

export const DisplayClinicNames = async (req, res, next) => {
	const data = await displayClinicNames()
	res.status(200).json(data)
}

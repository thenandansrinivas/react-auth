import { createPatientSchema, updatePatientSchema } from './schema.js'
import { displayPatientById, deletePatientById, updatePatientById, createPatient, displayPatient } from './service.js'
import _ from 'lodash'

export const display = async (req, res) => {
	const query = req.query
	const data = await displayPatient(query)
	res.status(200).json(data)
}
export const displayById = async (req, res) => {
	const { id } = req.params
	const data = await displayPatientById(id)
	res.status(200).json(data)
}
export const remove = async (req, res) => {
	const { id } = req.params
	await deletePatientById(id)
	res.sendStatus(204)
}
export const update = async (req, res) => {
	const { id } = req.params
	const data = updatePatientSchema.parse(req.body)
	if (data.dob) {
		const dob = new Date(data.dob)
		const age = new Date().getFullYear() - dob.getFullYear()
		data.dob = dob
		data.age = age
	}
	const updatedPatient = await updatePatientById(id, data)
	res.status(200).json(updatedPatient)
}
export const create = async (req, res) => {
	const data = createPatientSchema.parse(req.body)
	data.cBy = _.toString(req.user.id)
	const newPatient = await createPatient(data)
	res.status(201).json(newPatient)
}

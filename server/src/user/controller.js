import { createAccountSchema, updateAccountSchema, searchParamSchema } from './schema.js'
import { getAllUsers, postNewUser, deleteOneUser, patcExistingUser } from './service.js'

export const display = async (req, res, next) => {
	const request = searchParamSchema.parse(req.query)
	const data = await getAllUsers(request)
	res.status(200).send(data)
}

export const create = async (req, res, next) => {
	const request = createAccountSchema.parse(req.body)
	const data = await postNewUser(request)
	res.status(201).send(data)
}

export const update = async (req, res, next) => {
	const { id } = req.params
	const request = updateAccountSchema.parse(req.body)
	const data = await patcExistingUser(id, request)
	res.status(200).send(data)
}
export const remove = async (req, res, next) => {
	const { id } = req.params
	await deleteOneUser(id)
	res.sendStatus(204)
}
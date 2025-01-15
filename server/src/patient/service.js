import Patient from './model.js'
import createError from 'http-errors'

export const createPatient = async data => {
	const isPhoneExist = await Patient.findOne({ phone: data.phone })
	if (isPhoneExist) {
		throw createError.Conflict('Phone number already exist')
	}
	if (data.dob) {
		const dob = new Date(data.dob)
		const age = new Date().getFullYear() - dob.getFullYear()
		data.dob = dob
		data.age = age
	}
	return Patient.create(data)
}
export const displayPatient = async query => {
	const search = query.search || ''
	const page = query.page || 1
	const limit = query.limit || 5
	const skip = (page - 1) * limit
	const name = query.name || ''
	const phone = query.phone || ''
	const gender = query.gender || ''
	const age = parseInt(query.age) || ''
	const clinic = query.clinic || ''
	const sortBy = query.sortBy || 'createdAt'
	const orderBy = query.orderBy || 'desc'

	const searchConditions = []
	if (name) {
		searchConditions.push({ name: { $regex: `.*${name.trim()}.*`, $options: 'i' } })
	}
	if (phone) {
		searchConditions.push({ phone: { $regex: phone.trim(), $options: 'i' } })
	}
	if (gender) {
		searchConditions.push({ gender: { $regex: gender.trim(), $options: 'i' } })
	}
	if (age) {
		searchConditions.push({ age: { $gte: age } })
	}
	if (clinic) {
		searchConditions.push({ clinic: clinic })
	}
	if (search) {
		searchConditions.push({
			$or: [
				{ name: { $regex: `.*${search.trim()}.*`, $options: 'i' } },
				{ phone: { $regex: search.trim(), $options: 'i' } }
			]
		})
	}

	const sort = {}
	sort[sortBy] = orderBy === 'asc' ? 1 : -1
	const total = await Patient.countDocuments({ $and: searchConditions })
	const data = await Patient.find({ $and: searchConditions })
		.sort(sort)
		.skip(skip)
		.limit(limit)
		.populate('clinic', { name: 1 })

	const totalPages = Math.ceil(total / limit)
	const hasNextPage = page < totalPages
	const hasPrevPage = page > 1

	return {
		data,
		pagination: { currentPage: page, totalItems: total, totalPage: totalPages, hasNextPage, hasPrevPage },
		sort: { sortBy: sortBy, orderBy: orderBy }
	}
}
export const displayPatientById = async id => {
	const isPatientExist = await Patient.findById(id)
	if (!isPatientExist) {
		throw createError.NotFound('Patient not found')
	}
	return isPatientExist.populate('clinic', { name: 1 })
}
export const deletePatientById = async id => {
	const isPatientExist = await Patient.findById(id)
	if (!isPatientExist) {
		throw createError.NotFound('Patient not found')
	}
	return Patient.findByIdAndDelete(id)
}
export const updatePatientById = async (id, data) => {
	const isPatientExist = await Patient.findById(id)
	if (!isPatientExist) {
		throw createError.NotFound('Patient not found')
	}
	if (data.phone) {
		const isPhoneExist = await Patient.findOne({ phone: data.phone })
		if (isPhoneExist) {
			throw createError.Conflict('Phone number already exist')
		}
	}
	return Patient.findByIdAndUpdate(id, data, { new: true })
}

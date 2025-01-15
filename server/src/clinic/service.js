import createError from 'http-errors'
import Clinic from './model.js'

export const saveNewClinic = async request => {
	const { name, address, phone, mail } = request
	const isPhoneUnique = await Clinic.findOne({ phone })
	if (isPhoneUnique) throw createError.Conflict('Phone number already exists')
	const newClinic = new Clinic({ name, address, phone, mail })
	return newClinic.save()
}

export const deleteClinicById = async id => {
	const isClinicFound = await Clinic.findById({ _id: id })
	if (!isClinicFound) throw createError.NotFound('Clinic not found')
	return Clinic.findByIdAndDelete({ _id: id })
}

export const deleteBulkClinic = async ids => {
	const isClinicFound = await Clinic.find({ _id: { $in: ids } })
	if (!isClinicFound) throw createError.NotFound('Clinic not found')
	return Clinic.deleteMany({ _id: { $in: ids } })
}

export const displayClinicById = async id => {
	const isClinicFound = await Clinic.findById({ _id: id })
	if (!isClinicFound) throw createError.NotFound('Clinic not found')
	return isClinicFound
}

export const updateClinicById = async (id, request) => {
	const isClinicFound = await Clinic.findById({ _id: id })
	if (request.mail) {
		const isMailUnique = await Clinic.findOne({ mail: request.mail })
		if (isMailUnique) throw createError.Conflict('Mail already exists')
	}
	if (!isClinicFound) throw createError.NotFound('Clinic not found')
	return Clinic.findByIdAndUpdate({ _id: id }, request, { new: true })
}

export const searchClinicByQuery = async query => {
	const page = query.page || 1
	const limit = query.limit || 5
	const skip = (page - 1) * limit
	const name = query.name || ''
	const phone = query.phone || ''
	const mail = query.mail || ''
	const address = query.address || ''
	const sortField = query.sortField || 'createdAt'
	const sortOrder = query.sortOrder || 'desc'

	const searchConditions = []
	if (name) {
		searchConditions.push({ name: { $regex: name.trim(), $options: 'i' } })
	}
	if (phone) {
		searchConditions.push({ phone: { $regex: phone.trim(), $options: 'i' } })
	}
	if (mail) {
		searchConditions.push({ mail: { $regex: mail.trim(), $options: 'i' } })
	}
	if (address) {
		searchConditions.push({ address: { $regex: address.trim(), $options: 'i' } })
	}

	const searchQuery = searchConditions.length > 0 ? { $or: searchConditions } : {}

	// Build sort options
	const sortOptions = {}
	if (sortField) {
		sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1
	}

	const [total, clinics] = await Promise.all([
		Clinic.countDocuments(searchQuery),
		Clinic.find(searchQuery)
			.populate('cBy', 'name')
			.populate('uBy', 'name')
			.sort(sortOptions)
			.skip(skip)
			.limit(limit)
			.lean()
	])

	const totalPages = Math.ceil(total / limit)
	const hasNextPage = page < totalPages
	const hasPrevPage = page > 1

	return {
		data: clinics,
		pagination: {
			currentPage: page,
			totalPages,
			totalItems: total,
			itemsPerPage: limit,
			hasNextPage,
			hasPrevPage
		},
		sort: {
			field: sortField,
			order: sortOrder
		}
	}
}

export const displayClinicNames = async () => {
	const clinics = await Clinic.find({}, { name: 1, _id: 1 }).lean()
	return clinics
}

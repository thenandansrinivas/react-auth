import createError from 'http-errors'
import User from './model.js'

export const getAllUsers = async request => {
	const { name, gender, phone, email, roles, id, page = 1, limit = 10 } = request
	const query = {}
	if (name) {
		query.name = { $regex: name, $options: 'i' }
	}
	if (gender) {
		query.gender = gender.toLowerCase()
	}
	if (phone) {
		query.phone = { $regex: phone }
	}
	if (email) {
		query.email = { $regex: email, $options: 'i' }
	}
	if (roles) {
		query.roles = { $in: Array.isArray(roles) ? roles : [roles],  }
	}
	if (id) {
		query._id = id
	}

	const skip = (parseInt(page) - 1) * parseInt(limit)
	const total = await User.countDocuments(query)
	const users = await User.find(query).select('-password').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 })
	const totalPages = Math.ceil(total / parseInt(limit))
	const hasNext = page < totalPages
	const hasPrev = page > 1

	return {
		users,
		pagination: {
			total,
			page: parseInt(page),
			totalPages,
			hasNext,
			hasPrev,
			limit: parseInt(limit)
		}
	}
}

export const postNewUser = async data => {
	const isUserExist = await User.exists({ $or: [{ phone: data.phone }, { email: data.email }] })
	if (isUserExist) throw new createError.Conflict('Phone or email alredy exists')
	const newUser = new User(data)
	const savedUser = await newUser.save()
	return savedUser.omitPass()
}

export const deleteOneUser = async id => {
	const isUserExist = await User.exists({ _id: id })
	if (!isUserExist) throw new createError.NotFound('User not found')
	await User.deleteOne({ _id: id })
}

export const patcExistingUser = async (id, data) => {
	const isUserExist = await User.exists({ _id: id })
	if (!isUserExist) throw new createError.NotFound('User not found')
	const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })
	return updatedUser.omitPass()
}

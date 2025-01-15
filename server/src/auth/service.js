import createError from 'http-errors'
import User from '../user/model.js'
import { verifyPass } from '../utils/argon.js'
import { verifyRefreshToken } from '../utils/jwt.js'

export const validateRequest = async request => {
	const isUserExist = await User.exists({ $or: [{ phone: request.username }, { email: request.username }] }).where({
		isActive: true
	})
	if (!isUserExist) throw new createError.NotFound('User not found')
	const user = await User.findOne({ _id: isUserExist._id }).select('password roles')
	const confirmPass = await verifyPass(user.password, request.password)
	if (!confirmPass) throw new createError.Unauthorized('Invalid usernam or password')
	return { id: user._id, roles: user.roles }
}

export const authUser = async id => {
	const user = await User.loggedInUser(id)
	return user
}

export const validateRefreshToken = refresh => {
	if (!refresh) {
		throw new createError.BadRequest('Missing Refresh Token')
	}
	const payload = verifyRefreshToken(refresh)
	return payload
}

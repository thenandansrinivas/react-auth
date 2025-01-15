import { Schema, model } from 'mongoose'
import { generateId } from '../utils/nanoid.js'
import { hashPass } from '../utils/argon.js'

const userSchema = new Schema(
	{
		_id: {
			type: String,
			default: () => generateId()
		},
		profile: {
			name: String,
			url: String
		},
		name: {
			type: String,
			required: true,
			lowerCase: true,
			trim: true
		},
		phone: {
			type: String,
			required: true
		},
		gender: {
			type: String,
			enum: ['male', 'female'],
			required: true,
			lowerCase: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			lowerCase: true,
			trim: true
		},
		password: {
			type: String
		},
		roles: {
			type: [String],
			enum: ['admin', 'dev', 'moderator', 'doctor'],
			required: true
		},
		isActive: {
			type: Boolean,
			default: true
		}
	},
	{
		timestamps: true
	}
)

userSchema.pre('save', async function (next) {
	const user = this
	const password = user?.name?.slice(0, 3) + '@' + user?.phone?.slice(-3)
	user.password = await hashPass(password)
	next()
})

userSchema.methods.omitPass = function () {
	const user = this.toObject()
	delete user.password
	return user
}

userSchema.statics.loggedInUser = async function (id) {
	const user = await User.findOne({ _id: id }).select('name roles -_id')
	return user
}

const User = model('User', userSchema)

export default User

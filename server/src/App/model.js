import mongoose from 'mongoose'

const appSchema = new mongoose.Schema({
	name: {
		type: String
	},
	address: {
		type: String
	},
	phone: {
		type: String
	},
	mail: {
		type: String
	},
	website: {
		type: String
	},
	logo: {
		type: String
	},
	favicon: {
		type: String
	}
})

// Ensure only one record exists
appSchema.pre('save', async function (next) {
	if (this.isNew) {
		const count = await this.constructor.countDocuments()
		if (count > 0) {
			next(new Error('Only one app settings record can exist'))
		}
	}
	next()
})

const App = mongoose.model('app', appSchema)

export default App

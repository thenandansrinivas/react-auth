import mongoose from 'mongoose'

const clinicSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			lowercase: true,
			trim: true
		},
		address: {
			type: String,
			required: true,
			lowercase: true,
			trim: true
		},
		phone: {
			type: String,
			required: true,
			unique: true, // This already creates an index
			trim: true
		},
		mail: {
			type: String,
			lowercase: true,
			trim: true
		},
		cBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user'
		},
		uBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user'
		}
	},
	{
		timestamps: true
	}
)

// Add only necessary indexes that aren't already created
clinicSchema.index({ name: 'text', address: 'text' })
clinicSchema.index({ mail: 1 })

const Clinic = mongoose.model('clinic', clinicSchema)

export default Clinic

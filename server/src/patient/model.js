import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true, // Remove whitespace
			lowercase: true
		},
		dob: {
			type: Date
		},
		age: {
			type: Number
		},
		gender: {
			type: String,
			enum: ['male', 'female'],
			required: true
		},
		clinic: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'clinic',
			required: true
		},
		phone: {
			type: String,
			required: true,
			trim: true
		}
	},
	{
		timestamps: true
	}
)

patientSchema.index({ phone: 1, clinic: 1 }, { unique: true })
patientSchema.index({ name: 1 })

const Patient = mongoose.model('patient', patientSchema)

export default Patient

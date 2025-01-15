import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const generateShortId = () => {
	return uuidv4().split('-')[0]
}

const recordLogSchema = new mongoose.Schema({
	action: {
		type: String,
		enum: ['create', 'close', 'opened', 'removed', 'added']
	},
	time: {
		type: Date,
		default: Date.now
	},
	remarks: {
		type: String
	}
})

const trayLogSchema = new mongoose.Schema({
	action: {
		type: String,
		enum: ['added', 'removed', 'Scaling', 'Processing', 'Dispatched', 'Delivered']
	},
	time: {
		type: Date,
		default: Date.now
	},
	remarks: {
		type: String
	}
})

// Tray Item Schema
const trayItemSchema = new mongoose.Schema({
	type: {
		type: Number,
		required: true
	},
	status: {
		type: Boolean,
		default: false
	}
})

// Tray Schema
const traySchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: generateShortId
		},
		status: {
			type: String,
			enum: ['scale/Impression', 'process', 'dispatch', 'deliver', 'Delivered'],
			default: 'scale/Impression'
		},
		Scaling: {
			type: Boolean,
			default: false
		},
		Processing: {
			type: Boolean,
			default: false
		},
		Dispatched: {
			type: Boolean,
			default: false
		},
		Delivered: {
			type: Boolean,
			default: false
		},
		tray: {
			type: [trayItemSchema],
			validate: [
				{
					validator: function (type) {
						return type.length > 0
					},
					message: 'At least one tray is required'
				}
			]
		},
		Timeline: [trayLogSchema]
	},
	{
		timestamps: true
	}
)

// Record Schema
const recordSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
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
		phone: {
			type: String,
			required: true,
			trim: true
		},
		clinic: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'clinic',
			required: true
		},
		status: {
			type: String,
			enum: ['active', 'reopened', 'completed'],
			default: 'active'
		},
		trays: {
			type: [traySchema],
			required: true,
			validate: [
				{
					validator: function (trays) {
						return trays.length > 0
					},
					message: 'At least one tray is required'
				}
			]
		},
		Timeline: [recordLogSchema]
	},
	{
		timestamps: true
	}
)

recordSchema.index({ clinic: 1, patient: 1 })
recordSchema.index({ clinic: 1, createdAt: -1 })
recordSchema.methods.getStatusHistory = function () {
	return this.statusTimeline.sort((a, b) => b.timestamp - a.timestamp)
}

const Record = mongoose.model('Record', recordSchema)

export default Record

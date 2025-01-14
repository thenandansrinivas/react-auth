import mongoose from 'mongoose'
import config from './env.js'

const { MONGO_URI } = config

const connectDB = async () => {
	try {
		await mongoose.connect(MONGO_URI).then(() => {
			console.log('📡 Bits and bytes at your service ...')
		})

		mongoose.connection.on('disconnected', () => {
			console.log('🔌 Sealing the data vault ...')
		})

		mongoose.connection.on('error', error => {
			console.log(`❌ Bits and bytes in disarray: ${err.message}`)
		})

		mongoose.connection.on('closed', () => {
			console.log('🔴 Database hibernation mode engaged ...')
		})

		const gracefulShutdown = async signal => {
			try {
				console.warn(`Received ${signal}. Closing database connection...`)
				await mongoose.connection.close(true)
				console.log('Database connection closed successfully')
				process.exit(0)
			} catch (err) {
				console.error(`Error during shutdown: ${err.message}`)
				process.exit(1)
			}
		}

		const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT']
		signals.forEach(signal => {
			process.on(signal, () => gracefulShutdown(signal))
		})
	} catch (error) {
		console.log('Error connecting to database', error)
		process.exit(1)
	}
}

export default connectDB

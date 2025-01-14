import config from './config/env.js'
import server from './app.js'
import connectDB from './config/db.js'

const PORT = config.PORT
const ENV = config.ENV

const _init_ = async () => {
	try {
		await connectDB()

		// Start the server
		const app = server.listen(PORT, () => {
			console.log(`🔥 System engines purring ${ENV === 'dev' ? `in ${ENV} mode` : ''}`)
		})

		const gracefulShutdown = async signal => {
			console.warn(`Received ${signal}. Shutting down gracefully...`)

			try {
				app.close(() => {
					console.log('Server connections closed')
					process.exit(0)
				})
			} catch (error) {
				console.error(`Shutdown error: ${error.message}`)
				process.exit(1)
			}
		}

		;['SIGTERM', 'SIGINT'].forEach(signal => {
			process.on(signal, () => gracefulShutdown(signal))
		})

		process.on('unhandledRejection', (reason, promise) => {
			console.error('Unhandled Rejection:', reason)
			gracefulShutdown('UNHANDLED REJECTION')
		})

		process.on('uncaughtException', error => {
			console.error('Uncaught Exception:', error)
			gracefulShutdown('UNCAUGHT EXCEPTION')
		})
	} catch (error) {
		console.error(`Server initialization failed: ${error.message}`)
		process.exit(1)
	}
}

_init_()

import config from './config/env.js'
import server from './app.js'
import connectDB from './config/db.js'
import User from './user/model.js'

const { ENV, PORT } = config
const { NAME, EMAIL, GENDER, PHONE } = config.DEV

// Validate required environment variables
const validateEnv = () => {
	const requiredDevVars = {
		NAME,
		EMAIL,
		GENDER,
		PHONE
	}

	const missingVars = Object.entries(requiredDevVars)
		.filter(([_, value]) => !value)
		.map(([key]) => key)

	if (missingVars.length > 0) {
		console.error('❌ Missing required environment variables:', missingVars.join(', '))
		process.exit(1)
	}

	// Validate gender value
	if (!['male', 'female'].includes(GENDER.toLowerCase())) {
		console.error('❌ Invalid GENDER value. Must be either "male" or "female"')
		process.exit(1)
	}

	// Validate email format
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!emailRegex.test(EMAIL)) {
		console.error('❌ Invalid EMAIL format')
		process.exit(1)
	}

	console.log('✅ Environment validation passed')
}

const createDevUser = async () => {
	try {
		// Check if dev user already exists
		const existingDevUser = await User.findOne({ roles: 'dev' })

		if (!existingDevUser) {
			// Create new dev user using environment variables
			const devUser = new User({
				name: NAME,
				phone: PHONE,
				gender: GENDER.toLowerCase(),
				email: EMAIL,
				roles: ['dev']
			})

			await devUser.save()
			console.log('🔧 Dev user created successfully')
		} else {
			console.log('✅ Dev user already exists')
		}
	} catch (error) {
		console.error('Failed to create dev user:', error.message)
		throw error // Propagate error to main init function
	}
}

const init = async () => {
	try {
		// Validate environment variables before proceeding
		validateEnv()

		await connectDB()

		// Create dev user if doesn't exist
		await createDevUser()

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

init()

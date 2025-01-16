import dotenv from 'dotenv'

const ENV = process.env.NODE_ENV
const PE = process.env

dotenv.config({ path: '../' + (ENV === 'dev' ? '.env.dev' : '.env') })

const _env = {
	ENV: PE.ENV,
	PORT: PE.PORT,
	MONGO_URI: PE.MONGO_URI,
	SECRET_COOKIE: PE.SECRET_COOKIE,
	SECRET_JWTACCESS: PE.SECRET_JWTACCESS,
	JWTACCESS_EXPIN: PE.JWTACCESS_EXPIN,
	SECRET_JWTREFRESH: PE.SECRET_JWTREFRESH,
	JWTREFRESH_EXPIN: PE.JWTREFRESH_EXPIN,
	ORIGIN: PE.ORIGIN,
	DEV: {
		NAME: PE.DEV_NAME,
		PHONE: PE.DEV_PHONE,
		EMAIL: PE.DEV_EMAIL,
		GENDER: PE.DEV_GENDER
	}
}

const Config = Object.freeze(_env)

export default Config

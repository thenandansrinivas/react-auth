import config from '../config/env.js'

const { ENV, JWTACCESS_EXPIN, JWTREFRESH_EXPIN } = config

const genExpForCookies = EXPIN => {
	const unit = EXPIN.slice(-1)
	const value = parseInt(EXPIN.slice(0, -1), 10)

	let multiplier
	switch (unit) {
		case 'm':
			multiplier = 60 * 1000
			break
		case 'h':
			multiplier = 60 * 60 * 1000
			break
		case 'd':
			multiplier = 24 * 60 * 60 * 1000
			break
		case 'y':
			multiplier = 365 * 24 * 60 * 60 * 1000
			break
		default:
			throw new Error(`Invalid expiration format: ${EXPIN}`)
	}

	return new Date(Date.now() + value * multiplier)
}

export const setCookies = ({ res, access, refresh }) =>
	res
		.cookie('access', access, {
			path: '/',
			secure: ENV !== 'dev',
			sameSite: ENV === 'dev' ? 'lax' : 'strict',
			httpOnly: true,
			expires: genExpForCookies(JWTACCESS_EXPIN)
		})
		.cookie('refresh', refresh, {
			path: '/v1/auth/refresh',
			secure: ENV !== 'dev',
			sameSite: ENV === 'dev' ? 'lax' : 'strict',
			httpOnly: true,
			expires: genExpForCookies(JWTREFRESH_EXPIN)
		})

export const setAccessCookie = ({ res, access }) =>
	res.cookie('access', access, {
		path: '/',
		secure: ENV !== 'dev',
		sameSite: ENV === 'dev' ? 'lax' : 'strict',
		httpOnly: true
	})

export const clearCookies = ({ res }) =>
	res
		.clearCookie('access', {
			path: '/'
		})
		.clearCookie('refresh', {
			path: '/v1/auth/refresh'
		})

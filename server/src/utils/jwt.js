import jwt from 'jsonwebtoken'
import config from '../config/env.js'

const { SECRET_JWTACCESS, SECRET_JWTREFRESH, JWTACCESS_EXPIN, JWTREFRESH_EXPIN } = config

export const TokenGenerator = user => {
	const access = jwt.sign(user, SECRET_JWTACCESS, {
		expiresIn: JWTACCESS_EXPIN
	})
	const refresh = jwt.sign({ id: user.id }, SECRET_JWTREFRESH, {
		expiresIn: JWTREFRESH_EXPIN
	})

	return { access, refresh }
}

export const verifyRefreshToken = token => {
	return jwt.verify(token, SECRET_JWTREFRESH)
}

export const verifyAccessToken = token => {
	return jwt.verify(token, SECRET_JWTACCESS)
}

export const accessTokenGenerate = payload => {
	return jwt.sign(payload, SECRET_JWTACCESS, {
		expiresIn: JWTACCESS_EXPIN
	})
}

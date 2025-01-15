import { validateRequest, authUser, validateRefreshToken } from './service.js'
import { loginSchema } from './Schema.js'
import { TokenGenerator, accessTokenGenerate } from '../utils/jwt.js'
import { setCookies, setAccessCookie, clearCookies } from '../utils/cookie.js'

export const login = async (req, res, next) => {
	const request = loginSchema.parse(req.body)
	const user = await validateRequest(request)
	const Token = TokenGenerator(user)
	setCookies(res, Token).sendStatus(200)
}
export const refresh = async (req, res, next) => {
	const { refresh } = req.cookies
	const payload = validateRefreshToken(refresh)
	const token = accessTokenGenerate({ id: payload.id })
	setAccessCookie(res, token).sendStatus(200)
}
export const logout = async (req, res, next) => {
	clearCookies(res).sendStatus(200)
}
export const me = async (req, res, next) => {
	const { id } = req.user
	const user = await authUser(id)
	res.status(200).send(user)
}

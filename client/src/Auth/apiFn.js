import API from '../Utils/axios.js'

const meFn = async () => API.get('/auth/me')
const loginFn = async data => API.post('/auth/login', data)
const logoutFn = async () => API.get('/auth/logout')

export { meFn, loginFn, logoutFn }

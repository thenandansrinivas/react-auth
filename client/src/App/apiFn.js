import API from '../Utils/axios.js'

export const AppFn = async () => API.get('/app')
export const UpdateAppFn = async data => API.patch('/app', data)
export const updateAppLogoFn = async data => API.patch('/app/logo', data)

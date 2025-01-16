import API from '../Utils/axios.js'

export const updateUserFn = async ({ id, data }) => API.patch(`/user/${id}`, data)
export const getUsersFn = async query => API.get('/user', { params: query })

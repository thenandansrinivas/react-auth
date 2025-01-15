import API from '../Utils/axios.js'

export const ClinicFn = async params => API.get('/clinic', { params })
export const ClinicNamesFn = async () => API.get('/clinic/names')
export const RemoveClinicFn = async id => API.delete(`/clinic/${id}`)
export const BulkRemoveClinicFn = async ids => API.delete('/clinic', { data: { ids } })
export const UpdateClinicFn = async ({ id, data }) => {
	return API.patch(`/clinic/${id}`, data)
}
export const createNewClinic = async data => API.post('/clinic', data)

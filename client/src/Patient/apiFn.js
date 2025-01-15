import API from '../Utils/axios.js'

export const PatientFn = async params => API.get('/patient', { params })
export const RemovePatientFn = async id => API.delete(`/patient/${id}`)
export const UpdatePatientFn = async ({ id, data }) => API.patch(`/patient/${id}`, data)
export const createNewPatientFn = async data => API.post('/patient', data)

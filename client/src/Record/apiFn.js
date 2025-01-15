import API from '../Utils/axios.js'

export const RecordFn = async params => API.get('/record', { params })
export const CheckRecordFn = async data => API.post('/record/check', data)
export const newRecordFn = async data => API.post('/record', data)
export const updateTrayStatusFn = async ({ rid, tid, field, status, remarks }) =>
	API.patch(`/record/${rid}/tray/${tid}/status`, { field, status, remarks })
export const updateTrayTypeStatusFn = async ({ rid, tid, type, status }) =>
	API.patch(`/record/${rid}/tray/${tid}/type/status`, { type, status })
export const completeRecordFn = async ({ rid, status }) => API.patch(`/record/${rid}/complete`, { status })
export const deleteRecordFn = async id => API.delete(`/record/${id}`)
export const addTrayFn = async ({ rid, num }) => API.patch(`/record/${rid}/tray`, { num })
export const deleteTrayFn = async ({ rid, tid }) => API.delete(`/record/${rid}/tray/${tid}`)
export const deleteTrayTypeFn = async ({ rid, tid, typeid }) => API.delete(`/record/${rid}/tray/${tid}/type/${typeid}`)

export const displayLogsFn = async id => API.post(`/record/${id}/logs`)
export const reportGenFn = async data => API.post('/record/report', data, { responseType: 'arraybuffer' })

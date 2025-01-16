// api.js
import axios from 'axios'
import { qC } from '../Utils/queryClient.js'
import { customNavigate } from '../Utils/navigate'

const apiURL = import.meta.env.VITE_API_URL

const Options = {
	baseURL: apiURL,
	withCredentials: true
}

const RequestAfterTokenRefresh = axios.create(Options)
RequestAfterTokenRefresh.interceptors.response.use(response => response.data)

const API = axios.create(Options)

API.interceptors.response.use(
	response => response.data,
	async error => {
		const { config, response } = error
		const { status, name } = response?.data || {}

		if (status === 401 && name === 'InvalidAccessToken') {
			try {
				await API.get('/auth/refresh')
				return RequestAfterTokenRefresh(config)
			} catch (error) {
				qC.clear()
				customNavigate('/login', {
					state: {
						redirectUrl: window.location.pathname
					}
				})
			}
		}
		return Promise.reject({ status, ...name })
	}
)

export default API

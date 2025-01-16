import App from './model.js'

export const getOrCreateApp = async () => {
	let app = await App.findOne()
	if (!app) {
		app = await App.create({
			name: 'labapp'
			// Set other default values as needed
		})
	}
	return app
}

export const appdata = async () => {
	return await getOrCreateApp()
}

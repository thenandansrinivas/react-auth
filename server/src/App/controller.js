import fs from 'fs'
import path from 'path'
import { appdata, getOrCreateApp } from './service.js'
import { updateAppSchema } from './Schema.js'
import App from './model.js'

export const display = async (req, res, next) => {
	const data = await appdata()
	res.send(data)
}

export const update = async (req, res, next) => {
	const app = await getOrCreateApp()
	const request = updateAppSchema.parse(req.body)
	const updatedApp = await App.findByIdAndUpdate(app._id, request, { new: true })
	res.send(updatedApp)
}

export const logoUpdate = async (req, res, next) => {
	const url = `${req.protocol}://${req.get('host')}`
	const app = await getOrCreateApp()
	// Delete old file if it exists
	if (app.logo) {
		const oldFileName = app.logo.split('/').pop() // Get filename from URL
		const oldFilePath = path.join(req.file.destination, oldFileName)
		if (fs.existsSync(oldFilePath)) {
			fs.unlinkSync(oldFilePath)
		}
	}

	// Update with new logo URL
	const logoUrl = `${url}/v1/images/${req.file.filename}`
	const updatedApp = await App.findByIdAndUpdate(app._id, { logo: logoUrl }, { new: true })

	res.send(updatedApp?.logo)
}

export const faviconUpdate = async (req, res, next) => {
	const url = `${req.protocol}://${req.get('host')}`
	const app = await getOrCreateApp()

	// Delete old favicon if it exists
	if (app.favicon) {
		const oldFileName = app.favicon.split('/').pop()
		const oldFilePath = path.join(req.file.destination, oldFileName)
		if (fs.existsSync(oldFilePath)) {
			fs.unlinkSync(oldFilePath)
		}
	}

	// Update with new favicon URL
	const faviconUrl = `${url}/v1/images/${req.file.filename}`
	const updatedApp = await App.findByIdAndUpdate(app._id, { favicon: faviconUrl }, { new: true })

	res.send(updatedApp?.favicon)
}

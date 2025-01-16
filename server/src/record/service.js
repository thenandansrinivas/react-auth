import Record from './model.js'
import Patient from '../patient/model.js'
import createError from 'http-errors'
import _ from 'lodash'
import { format } from 'date-fns'
import puppeteer from 'puppeteer'
import { getOrCreateApp } from '../App/service.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const displayRecords = async (query = {}) => {
	// Extract query parameters with defaults
	const search = query.search || ''
	const page = parseInt(query.page) || 1
	const limit = parseInt(query.limit) || 5
	const skip = (page - 1) * limit
	const status = query.status || ''
	const clinic = query.clinic || ''
	const gender = query.gender || ''
	const sortBy = query.sortBy || 'createdAt'
	const orderBy = query.orderBy || 'desc'

	// Build search conditions array
	const searchConditions = []

	// Add search condition for name and phone
	if (search) {
		searchConditions.push({
			$or: [
				{ name: { $regex: `.*${search.trim()}.*`, $options: 'i' } },
				{ phone: { $regex: search.trim(), $options: 'i' } }
			]
		})
	}

	// Add status filter
	if (status) {
		searchConditions.push({ status: status })
	}

	// Add clinic filter
	if (clinic) {
		searchConditions.push({ clinic: clinic })
	}

	// Add gender filter
	if (gender) {
		searchConditions.push({ gender: gender })
	}

	// Prepare sort object
	const sort = {}
	sort[sortBy] = orderBy === 'asc' ? 1 : -1

	try {
		// Get total count and data
		const conditions = searchConditions.length > 0 ? { $and: searchConditions } : {}

		// Execute both queries in parallel
		const [total, rawData] = await Promise.all([
			Record.countDocuments(conditions),
			Record.find(conditions).sort(sort).skip(skip).limit(limit).populate('clinic', { name: 1 }).lean() // Convert to plain JavaScript objects
		])

		// Ensure data is an array
		const data = Array.isArray(rawData) ? rawData : []

		// Calculate pagination values
		const totalPages = Math.ceil(total / limit)
		const hasNextPage = page < totalPages
		const hasPrevPage = page > 1

		return {
			data,
			pagination: {
				currentPage: page,
				totalItems: total,
				totalPages: totalPages,
				itemsPerPage: limit,
				hasNextPage,
				hasPrevPage
			},
			sort: {
				field: sortBy,
				order: orderBy
			}
		}
	} catch (error) {
		return {
			data: [],
			pagination: {
				currentPage: page,
				totalItems: 0,
				totalPages: 0,
				itemsPerPage: limit,
				hasNextPage: false,
				hasPrevPage: false
			},
			sort: {
				field: sortBy,
				order: orderBy
			}
		}
	}
}
export const chechPatientFn = async data => {
	const isRecordExist = await Record.findOne({ patient: data.patient, status: 'active' })
	if (isRecordExist) {
		throw createError(409, 'There is already an active record for this patient')
	}
	return isRecordExist
}

export const createNewRecord = async data => {
	const isPatientExist = await Patient.findOne({ phone: data.phone })

	if (!isPatientExist) {
		const newPatient = new Patient(data)
		await newPatient.save()
	}
	const { trays } = data
	const newTrays = trays.map(num => ({ type: num }))
	const newRecord = new Record({ ...data, trays: { tray: newTrays } })
	newRecord.Timeline.push({ action: 'create', remarks: `Record Created with ${_.toString(trays)} trays` })
	const record = await newRecord.save()
	return record
}

export const updateTrayStatusFn = async ({ rid, tid, field, status, remarks }) => {
	const record = await Record.findById(rid)
	if (!record) {
		throw createError(404, 'Record not found')
	}
	const tray = record.trays.find(tray => tray._id.toString() === tid)
	if (!tray) {
		throw createError(404, 'Tray not found')
	}
	tray[field] = status
	if (tray.status === 'scale/Impression') {
		tray.status = 'process'
		tray.Timeline.push({ action: 'Scaling', remarks })
	} else if (tray.status === 'process') {
		tray.status = 'dispatch'
		tray.Timeline.push({ action: 'Processing', remarks })
	} else if (tray.status === 'dispatch') {
		tray.status = 'deliver'
		tray.Timeline.push({ action: 'Dispatched', remarks })
	} else if (tray.status === 'deliver') {
		tray.status = 'Delivered'
		tray.Timeline.push({ action: 'Delivered', remarks })
	}
	await record.save()
	return record
}

export const updateTrayTypeStatusFn = async ({ rid, tid, type, status }) => {
	const record = await Record.findById(rid)
	if (!record) {
		throw createError(404, 'Record not found')
	}
	const tray = record.trays.find(tray => tray._id.toString() === tid)
	if (!tray) {
		throw createError(404, 'Tray not found')
	}
	const trayType = tray.tray.find(item => item._id.toString() === type)
	if (!trayType) {
		throw createError(404, 'Tray type not found')
	}
	trayType.status = status
	await record.save()
	return record
}

export const completeRecordFn = async ({ rid, status }) => {
	const record = await Record.findById(rid)
	if (!record) {
		throw createError(404, 'Record not found')
	}

	record.status = status
	record.Timeline.push({
		action: status === 'reopened' ? 'opened' : 'close',
		remarks: status === 'reopened' ? 'Record Reopened' : 'Record Closed'
	})
	await record.save()
	return record
}

export const deleteRecord = async rid => {
	const record = await Record.findByIdAndDelete(rid)
	return record
}

export const addNewTrayToRecord = async ({ rid, tray }) => {
	const record = await Record.findById(rid)
	if (!record) {
		throw createError(404, 'Record not found')
	}
	const newTrays = tray.map(num => ({ type: num }))
	record.trays.push({ tray: newTrays })
	record.Timeline.push({ action: 'added', remarks: `Added ${_.toString(tray)} trays to the record` })
	await record.save()
	return record
}

export const removeTrayFn = async ({ rid, tid }) => {
	const record = await Record.findById(rid)
	if (!record) {
		throw createError(404, 'Record not found')
	}
	const tray = record.trays.find(tray => tray._id.toString() === tid)
	if (!tray) {
		throw createError(404, 'Tray not found')
	}
	record.trays = record.trays.filter(tray => tray._id.toString() !== tid)
	record.Timeline.push({
		action: 'removed',
		remarks: `Removed ${_.toString(tray.tray.map(tray => tray.type))} tray from the record`
	})
	await record.save()
	return record
}

export const deleteTrayTypeFn = async ({ rid, tid, typeid }) => {
	const record = await Record.findById(rid)
	if (!record) {
		throw createError(404, 'Record not found')
	}
	const tray = record.trays.find(tray => tray._id.toString() === tid)
	if (!tray) {
		throw createError(404, 'Tray not found')
	}
	const trayType = tray.tray.find(item => item._id.toString() === typeid)
	if (!trayType) {
		throw createError(404, 'Tray type not found')
	}
	tray.tray = tray.tray.filter(item => item._id.toString() !== typeid)
	await record.save()
	return record
}

export const displayLogsFn = async rid => {
	const record = await Record.findById(rid).populate('clinic', { name: 1 })
	const recordDetails = {
		name: record.name,
		dob: record.dob,
		age: record.age,
		clinic: record.clinic?.name,
		phone: record.phone,
		gender: record.gender,
		status: record.status
	}

	if (!record) {
		throw new Error('Record not found')
	}

	// Format a single log entry
	const formatLog = (log, type, trayId = null) => ({
		type, // 'record' or 'tray'
		trayId,
		action: log.action,
		time: log.time,
		formattedTime: format(new Date(log.time), "do MMM yyyy 'at' h:mm a"),
		remarks: log.remarks ?? ''
	})

	// Get record level logs
	const recordLogs = record.Timeline.map(log => formatLog(log, 'record'))

	// Get tray level logs
	const trayLogs = record.trays.flatMap(tray => tray.Timeline.map(log => formatLog(log, 'tray', tray._id)))

	// Combine and sort all logs
	const combinedLogs = [...recordLogs, ...trayLogs].sort((a, b) => new Date(a.time) - new Date(b.time))

	return { details: recordDetails, logs: combinedLogs }
}

export const generateLogReport = async data => {
	if (!data) {
		throw new Error('HTML content is required')
	}

	const app = await getOrCreateApp()
	const primaryColor = '#0066CC'

	// Logo handling with error checking
	let logoBase64 = ''
	try {
		if (app?.logo) {
			const logoName = app.logo.split('/').pop()
			let logoPath = path.join(__dirname, '../../uploads/app', logoName)

			// Check if custom logo exists
			if (fs.existsSync(logoPath)) {
				logoBase64 = Buffer.from(fs.readFileSync(logoPath)).toString('base64')
			} else {
				// Try default logo
				const defaultLogoPath = path.join(__dirname, '../../uploads/app', 'logo.svg')
				if (fs.existsSync(defaultLogoPath)) {
					logoBase64 = Buffer.from(fs.readFileSync(defaultLogoPath)).toString('base64')
				}
			}
		}
	} catch (error) {
		console.error('Error loading logo:', error)
		// Continue without logo if there's an error
	}

	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.setContent(data, { waitUntil: 'networkidle0' })

	const headerHtml = `
    <div style="
      font-family: Arial, sans-serif;
      background: linear-gradient(to right, ${primaryColor}15, ${primaryColor}05);
      padding: 20px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;
      height: 80px;
    ">
      <div style="display: flex; align-items: center;">
        ${
			logoBase64
				? `<img src="data:image/svg+xml;base64,${logoBase64}" 
               style="width: 40px; height: auto; margin-right: 15px;" />`
				: ''
		}
        <div>
          <div style="font-size: 16px; font-weight: bold; color: ${primaryColor};">
            ${app?.name || 'Company Name'}
          </div>
        </div>
      </div>
      <div style="text-align: right; font-size: 10px; color: #666; line-height: 1.6;">
        <div style="margin-bottom: 4px; font-weight: bold; color: ${primaryColor};">
          ${app?.phone || ''}
        </div>
        <div style="margin-bottom: 4px;">${app?.mail || ''}</div>
        <div>${app?.address || ''}</div>
      </div>
    </div>
  `

	const footerHtml = `
    <div style="
      font-family: Arial, sans-serif;
      background: linear-gradient(to right, ${primaryColor}15, ${primaryColor}05);
      padding: 10px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: calc(100% - 80px);
      box-sizing: border-box;
      font-size: 10px;
      color: #666;
      height: 40px;
    ">
      <div>Generated on <span style="color: ${primaryColor};">${format(new Date(), 'dd MMMM yyyy, h:mm a')}</span></div>
      <div>
        <a href="https://${app?.website || ''}" 
           target="_blank" 
           rel="noopener noreferrer" 
           style="color: ${primaryColor}; text-decoration: none;">
          ${app?.website || ''}
        </a>
      </div>
      <div>
        Page <span class="pageNumber"></span> of <span class="totalPages"></span>
      </div>
    </div>
  `

	const pdfBuffer = await page.pdf({
		format: 'A4',
		printBackground: true,
		margin: {
			top: '90px',
			bottom: '50px',
			left: '20px',
			right: '20px'
		},
		headerTemplate: `
      <style>
        .header { 
          font-size: 10px; 
          font-family: Arial, sans-serif; 
          color: #666; 
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      </style>
      ${headerHtml}
    `,
		footerTemplate: `
      <style>
        .footer { 
          font-size: 10px; 
          font-family: Arial, sans-serif; 
          color: #666;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      </style>
      ${footerHtml}
    `,
		displayHeaderFooter: true,
		preferCSSPageSize: true
	})

	await browser.close()
	return pdfBuffer
}

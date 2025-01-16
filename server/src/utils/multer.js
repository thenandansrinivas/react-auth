import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Function to create folder if it doesn't exist
const createFolderIfNotExists = folderPath => {
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true })
	}
}

// Create configurable multer middleware
const createUploadMiddleware = (fieldName = 'file', defaultFolder = '') => {
	const storage = multer.diskStorage({
		destination: function (req, file, cb) {
			const uploadPath = path.join('uploads', defaultFolder)
			console.log(uploadPath)
			createFolderIfNotExists(uploadPath)
			cb(null, uploadPath)
		},
		filename: function (req, file, cb) {
			const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
			cb(null, uniqueSuffix + path.extname(file.originalname))
		}
	})

	const fileFilter = (req, file, cb) => {
		cb(null, true)
	}

	const upload = multer({
		storage,
		fileFilter
	}).single(fieldName)

	// Return wrapped middleware with error handling
	return (req, res, next) => {
		upload(req, res, err => {
			if (err) {
				console.error('Upload error:', err)
				return res.status(400).json({
					error: 'File upload failed',
					details: err.message
				})
			}
			next()
		})
	}
}

export const upload = createUploadMiddleware('file', 'app')
export const createUpload = (fieldName, folder = 'app') => createUploadMiddleware(fieldName, folder)

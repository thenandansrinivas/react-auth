import { Router } from 'express'
import { asyncErrorHandler } from '../middlewares/error.js'
import { display, update, logoUpdate, faviconUpdate } from './controller.js'
import { createUpload } from '../utils/multer.js'

const logoUpload = createUpload('logo', 'app')
const faviconUpload = createUpload('favicon', 'app')

const App = Router()

App.get('/', asyncErrorHandler(display))
App.patch('/', asyncErrorHandler(update))
App.patch('/logo', logoUpload, asyncErrorHandler(logoUpdate))
App.patch('/favicon', faviconUpload, asyncErrorHandler(faviconUpdate))

export default App

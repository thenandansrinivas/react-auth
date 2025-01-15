import { Router } from 'express'
import user from './user/route.js'
import auth from './auth/route.js'
import clinic from './clinic/routes.js'
import patient from './patient/routes.js'
import record from './record/routes.js'
import app from './App/route.js'
import { Authenticate } from './middlewares/route.js'

const router = Router()

router.use('/user', Authenticate, user)
router.use('/auth', auth)
router.use('/clinic', Authenticate, clinic)
router.use('/patient', Authenticate, patient)
router.use('/record', Authenticate, record)
router.use('/app', app)

export default router

import { Router } from 'express'
import user from './user/route.js'
import auth from './auth/route.js'
import clinic from './clinic/routes.js'
import { Authenticate } from './middlewares/route.js'

const router = Router()

router.use('/user', Authenticate, user)
router.use('/auth', auth)
router.use('/clinic', clinic)

export default router

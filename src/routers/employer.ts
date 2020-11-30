import express from 'express'

import {
  localLogin,
  registerEmployer,
  createJobPost,
  updateJobPost,
} from '../controllers/employer'

const router = express.Router()

router.post('/login/local', localLogin)
router.post('/create', registerEmployer)
router.post('/jobs/:companyName', createJobPost)
router.put('/jobs/:id', updateJobPost)

export default router

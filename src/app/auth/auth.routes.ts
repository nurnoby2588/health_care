import express from 'express'
import { AuthController } from './auth.controller'
import auth from '../middleware/auth'
import { UserRole } from '../../generated/prisma'
const router = express.Router()
router.post('/login', AuthController.loginUser)
router.post('/refresh-token', AuthController.refreshToken)
router.post('/change-password', auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN), AuthController.changePassword)
router.post('/forget-password', AuthController.forgetPassword)
router.post('/reset-password', AuthController.resetPassword)

export const AuthRoutes = router 
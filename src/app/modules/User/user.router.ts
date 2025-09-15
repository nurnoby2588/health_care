import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import { jwtHelper } from '../../../healper/jwtHelper';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import auth from '../../middleware/auth';
import { UserRole } from '../../../generated/prisma';
const router = express.Router()


router.post('/', auth(UserRole.ADMIN,UserRole.SUPER_ADMIN), userController.createAdmin)

export const userRouter = router;
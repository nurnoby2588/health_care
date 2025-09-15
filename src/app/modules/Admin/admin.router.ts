import express, { NextFunction, Request, Response } from 'express'
import { adminController } from './admin.controller';
import { z, ZodObject } from "zod";
import vaidablerequest from '../../middleware/vaidablerequest';
import { adminFillterSchema } from './admin.validation';
import auth from '../../middleware/auth';
import { UserRole } from '../../../generated/prisma';


const router = express.Router();
router.get('/', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.getAllFromDB)
router.get('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.getDataByIdFromDB)
router.patch('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), vaidablerequest(adminFillterSchema.Update), adminController.updateDataByIdFromDB)
router.delete('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.deleteDataByIdFromDB)
router.delete('/soft/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.softDeleteDataByIdFromDB)
export const adminRouter = router
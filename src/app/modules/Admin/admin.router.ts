import express, { NextFunction, Request, Response } from 'express'
import { adminController } from './admin.controller';
import { z, ZodObject } from "zod";
import vaidablerequest from '../../middleware/vaidablerequest';
import { adminFillterSchema } from './admin.validation';


const router = express.Router();
router.get('/', adminController.getAllFromDB)
router.get('/:id', adminController.getDataByIdFromDB)
router.patch('/:id', vaidablerequest(adminFillterSchema.Update), adminController.updateDataByIdFromDB)
router.delete('/:id', adminController.deleteDataByIdFromDB)
router.delete('/soft/:id', adminController.softDeleteDataByIdFromDB)
export const adminRouter = router
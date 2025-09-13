import express from 'express'
import { adminController } from './admin.controller';

const router = express.Router();
router.get('/', adminController.getAllFromDB)
router.get('/:id', adminController.getDataByIdFromDB)
router.patch('/:id', adminController.updateDataByIdFromDB)
router.delete('/:id', adminController.deleteDataByIdFromDB)
export const adminRouter = router
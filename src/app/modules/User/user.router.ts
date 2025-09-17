import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import auth from '../../middleware/auth';
import { UserRole } from '../../../generated/prisma';
import { fileUploader } from '../../../healper/fileUploder';
import { userValidation } from './user.validation';
const router = express.Router()

router.post('/create-admin',

    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), fileUploader.upload.single('profilePicture'), (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))

        return userController.createAdmin(req, res, next)
    },
)
router.post('/create-doctor',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), fileUploader.upload.single('profilePicture'), (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data))
        return userController.createDoctor(req, res, next)
    },
)
router.post('/create-patient',
    fileUploader.upload.single('profilePicture'), (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createPatient.parse(JSON.parse(req.body.data))
        return userController.createPatient(req, res, next)
    },
)

export const userRouter = router;
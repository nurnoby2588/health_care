import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import { jwtHelper } from '../../../healper/jwtHelper';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import auth from '../../middleware/auth';
import { UserRole } from '../../../generated/prisma';
import { fileUploader } from '../../../healper/fileUploder';
import { userValidation } from './user.validation';
const router = express.Router()

router.post('/',

    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), fileUploader.upload.single('profilePicture'), (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))

        return userController.createAdmin(req, res, next)
    },
)

// router.post('/', (req: Request, res: Response, next: NextFunction) => {
//     console.log(req.body)
//     const value = userValidation.createAdmin.parse(JSON.parse(req.body.data))
//     console.log(value)
// })

export const userRouter = router;
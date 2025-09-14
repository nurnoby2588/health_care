import express from 'express';
import { userRouter } from '../modules/User/user.router';
import { adminRouter } from '../modules/Admin/admin.router';

const router = express.Router();
const moduleRoute = [
    {
        path: '/admin',
        route: adminRouter

    },
    {
        path: '/user',
        route: userRouter
    }
]
moduleRoute.forEach(route=> router.use(route.path,route.route))

export default router;
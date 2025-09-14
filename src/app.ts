import express, { Application, NextFunction, Request, Response, urlencoded } from "express";
import cors from 'cors'
import { userRouter } from "./app/modules/User/user.router";
import { adminRouter } from "./app/modules/Admin/admin.router";
import router from "./app/routes";
import status from "http-status";
import globalErrorHandler from "./app/middleware/globalErrorHandler";

const app: Application = express()

// middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/v1', router)
app.use(globalErrorHandler)
app.get('/', (req: Request, res: Response) => {
    res.send({ msg: "app is running" })
})

app.use((req: Request, res: Response) => {
    res.status(status.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        error: {
            path: req.originalUrl,
            message: "The requested URL was not found on this server."
        }
    })
})

export default app;
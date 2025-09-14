import express, { Application, Request, Response, urlencoded } from "express";
import cors from 'cors'
import { userRouter } from "./app/modules/User/user.router";
import { adminRouter } from "./app/modules/Admin/admin.router";
import router from "./app/routes";

const app: Application = express()

// middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
    res.send({ msg: "app is running" })
})

export default app;
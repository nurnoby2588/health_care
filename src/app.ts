import express, { Application, Request, Response } from "express";
import cors from 'cors'

const app: Application = express()

// middleware
app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send({ msg: "app is running" })
})

export default app;
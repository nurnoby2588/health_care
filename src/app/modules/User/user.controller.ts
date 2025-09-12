import { Request, Response } from "express";
import { userServies } from "./user.serveices";

const createAdmin = async (req: Request, res: Response) => {
    const result = await userServies.createAdmin(req.body);
    res.send(result)
}

export const userController = { createAdmin }
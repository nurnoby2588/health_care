import { Request, Response } from "express";
import { userServices } from "./user.serveices";

const createAdmin = async (req: Request, res: Response) => {
  try {
      const result = await userServices.createAdmin(req.body);
    res.status(201).json({
        success: true,
        message: "Admin created successfully",
        data: result
    })
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: error?.name || "Something went wrong",
        error: error
    })
  }
}

export const userController = { createAdmin }
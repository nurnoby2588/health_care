import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.serveices";
import sendResponse from "../../../Shared/sendResponse";
import status from "http-status";

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServices.createAdmin(req.body);
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Admin created successfully",
      data: result
    })

  } catch (error: any) {
  next()
  }
}

export const userController = { createAdmin }
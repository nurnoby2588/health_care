import { Request, Response } from "express";
import { userServices } from "./user.serveices";
import sendResponse from "../../../Shared/sendResponse";
import status from "http-status";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createAdmin(req.body);
    sendResponse(res, {
      success: true,
      statusCode: status.CREATED,
      message: "Admin created successfully",
      data: result
    })

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.name || "Something went wrong",
      error: error
    })
  }
}

export const userController = { createAdmin }
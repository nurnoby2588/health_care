import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.serveices";
import sendResponse from "../../../Shared/sendResponse";
import status from "http-status";
import catchAsync from "../../../Shared/catchAsync";

const createAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await userServices.createAdmin(req);
  console.log({ result })
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Admin created successfully",
    data: result
  })
})

export const userController = { createAdmin }
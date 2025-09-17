import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.serveices";
import sendResponse from "../../../Shared/sendResponse";
import status from "http-status";
import catchAsync from "../../../Shared/catchAsync";

const createAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await userServices.createAdmin(req);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Admin created successfully",
    data: result
  })
})
const createDoctor = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await userServices.createDoctor(req);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Doctor created successfully",
    data: result
  })
})
const createPatient = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await userServices.createPatient(req);
  sendResponse(res, {
    success: true,
    statusCode: status.CREATED,
    message: "Doctor created successfully",
    data: result
  })
})

export const userController = { createAdmin , createDoctor,createPatient }
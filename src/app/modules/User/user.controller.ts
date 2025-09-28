import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.serveices";
import sendResponse from "../../../Shared/sendResponse";
import status from "http-status";
import catchAsync from "../../../Shared/catchAsync";
import { ok } from "assert";
import pick from "../../../Shared/pick";
import { userFilterData, userPagenationField } from "./user.constant";

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

const getUsersFromDB = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const fillterData = pick(req.query, userFilterData)
  const options = pick(req.query, userPagenationField)
  const result = await userServices.getUsersFromDB(fillterData, options)
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User data fetch successfully",
    data: result
  })
})

const changeProfileStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await userServices.changeProfileStatus(id, req.body)
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Profile status changed successfully",
    data: result
  })
})
const myProfile = catchAsync(async (req: Request&{user?:any}, res: Response, next: NextFunction) => {
  const user = req.user
  const result = await userServices.myProfile(user)
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "My profile fetched successfully",
    data: result
  })
})

export const userController = { createAdmin, createDoctor, createPatient, getUsersFromDB, changeProfileStatus, myProfile };
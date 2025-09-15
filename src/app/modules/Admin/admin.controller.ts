import { NextFunction, Request, RequestHandler, Response } from "express";
import { adminServies } from "./admin.services";
import pick from "../../../Shared/pick";
import { adminFillterAbleFields, adminPagenationField } from "./admin.constant";
import sendResponse from "../../../Shared/sendResponse";
import status from "http-status";
import catchAsync from "../../../Shared/catchAsync";


const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const fillterData = pick(req.query, adminFillterAbleFields)
    const options = pick(req.query, adminPagenationField)

    const result = await adminServies.getAllFromDB(fillterData, options);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Admin data fetched",
        meta: result.meta,
        data: result.data
    })

})

const getDataByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params

    const result = await adminServies.getDataByIdFromDB(id)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin data fetch by id successfully",
        data: result
    })
})
const updateDataByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body

    const result = await adminServies.updateDataByIdFromDB(id, body)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin data updated by id successfully",
        data: result
    })
})
const deleteDataByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminServies.deleteDataByIdFromDB(id)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Admin data deleted by id successfully",
        data: result
    })

})

const softDeleteDataByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminServies.softDeleteDataByIdFromDB(id)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Admin data deleted by id successfully",
        data: result
    })

})

export const adminController = { getAllFromDB, getDataByIdFromDB, updateDataByIdFromDB, deleteDataByIdFromDB, softDeleteDataByIdFromDB }
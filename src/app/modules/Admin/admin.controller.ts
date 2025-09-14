import { NextFunction, Request, Response } from "express";
import { adminServies } from "./admin.services";
import pick from "../../../Shared/pick";
import { adminFillterAbleFields, adminPagenationField } from "./admin.constant";
import sendResponse from "../../../Shared/sendResponse";
import status from "http-status";



const getAllFromDB = async (req: Request, res: Response , next: NextFunction) => {
    const fillterData = pick(req.query, adminFillterAbleFields)
    const options = pick(req.query, adminPagenationField)
    try {
        const result = await adminServies.getAllFromDB(fillterData, options);
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Admin data fetched",
            meta: result.meta,
            data: result.data
        })
    } catch (error: any) {
       next(error)
    }
}

const getDataByIdFromDB = async (req: Request, res: Response , next: NextFunction) => {
    const { id } = req.params
    try {
        const result = await adminServies.getDataByIdFromDB(id)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Admin data fetch by id successfully",
            data: result
        })
    } catch (error: any) {
        console.log("in catch")
       next(error)
    }
}
const updateDataByIdFromDB = async (req: Request, res: Response , next: NextFunction) => {
    const { id } = req.params;
    const body = req.body
    try {
        const result = await adminServies.updateDataByIdFromDB(id, body)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Admin data updated by id successfully",
            data: result
        })
    } catch (error: any) {
       next(error)
    }
}
const deleteDataByIdFromDB = async (req: Request, res: Response , next: NextFunction) => {
    const { id } = req.params;
    try {
        const result = await adminServies.deleteDataByIdFromDB(id)
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Admin data deleted by id successfully",
            data: result
        })
    } catch (error: any) {
         next(error)
    }
}

const softDeleteDataByIdFromDB = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const result = await adminServies.softDeleteDataByIdFromDB(id)
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Admin data deleted by id successfully",
            data: result
        })
    } catch (error: any) {
        next(error)
    }
}

export const adminController = { getAllFromDB, getDataByIdFromDB, updateDataByIdFromDB, deleteDataByIdFromDB, softDeleteDataByIdFromDB }
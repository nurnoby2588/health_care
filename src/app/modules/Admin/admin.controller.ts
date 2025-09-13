import { Request, Response } from "express";
import { adminServies } from "./admin.services";
import pick from "../../../Shared/pick";
import { adminFillterAbleFields, adminPagenationField } from "./admin.constant";

const getAllFromDB = async (req: Request, res: Response) => {
    const fillterData = pick(req.query, adminFillterAbleFields)
    const options = pick(req.query, adminPagenationField)
    try {
        const result = await adminServies.getAllFromDB(fillterData, options);
        res.status(200).json({
            success: true,
            message: "Admin data fetched",
            meta: result.meta,
            data: result.data

        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error?.name || "Something went wrong",
            error: error
        })
    }
}

const getDataByIdFromDB = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const result = await adminServies.getDataByIdFromDB(id)
        return res.status(200).json({
            success: true,
            message: "Admin data fetch by id successfully",
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
const updateDataByIdFromDB = async (req: Request, res: Response) => {
    const { id } = req.params;
    const body = req.body
    try {
        const result = await adminServies.updateDataByIdFromDB(id,body)
        return res.status(200).json({
            success: true,
            message: "Admin data updated by id successfully",
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
const deleteDataByIdFromDB = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await adminServies.deleteDataByIdFromDB(id)
        return res.status(200).json({
            success: true,
            message: "Admin data deleted by id successfully",
            data: result
        })
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error?.meta.cause || "Something went wrong",
            error: error
        })
    }
}

export const adminController = { getAllFromDB, getDataByIdFromDB, updateDataByIdFromDB,deleteDataByIdFromDB }
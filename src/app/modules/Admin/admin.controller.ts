import { Request, Response } from "express";
import { adminServies } from "./admin.services";
import pick from "../../../Shared/pick";
import { adminFillterAbleFields, adminPagenationField } from "./admin.constant";

const getAllFromDB = async (req: Request, res: Response) => {
    const fillterData = pick(req.query, adminFillterAbleFields)
    const options = pick(req.query,adminPagenationField)
    try {
        const result = await adminServies.getAllFromDB(fillterData,options);
        res.status(200).json({
            success: true,
            message: "Admin data fetched",
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

export const adminController = { getAllFromDB }
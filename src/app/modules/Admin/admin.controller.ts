import { Request, Response } from "express";
import { adminServies } from "./admin.services";

const getAllFromDB = async (req: Request, res: Response) => {
    try {
        const result = await adminServies.getAllFromDB(req.query);
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
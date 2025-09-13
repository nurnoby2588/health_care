import { Request, Response } from "express";
import { adminServies } from "./admin.services";

const getAllFromDB = async (req: Request, res: Response) => {
    const result = await adminServies.getAllFromDB();
    res.status(200).json({
        success: true,
        message: "Admin data fetched",
        data: result
    })
}
export const adminController = { getAllFromDB }
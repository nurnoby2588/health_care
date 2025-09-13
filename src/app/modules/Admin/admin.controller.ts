import { Request, Response } from "express";
import { adminServies } from "./admin.services";
import pick from "../../../Shared/pick";

const getAllFromDB = async (req: Request, res: Response) => {
    const fillterData = pick(req.query, ['name', 'email', 'contactNumber', 'searchTerm'])
    try {
        const result = await adminServies.getAllFromDB(fillterData);
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
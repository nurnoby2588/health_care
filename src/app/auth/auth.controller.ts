import { Request, Response } from "express";
import catchAsync from "../../Shared/catchAsync";
import { AuthServices } from "./auth.services";
import sendResponse from "../../Shared/sendResponse";
import status from "http-status";


const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.loginUser(req.body);
    const { refreshToken, accessToken } = result;
    res.cookie("accessToken", accessToken, {
        secure: false,
        httpOnly: true
    })
    res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true
    })
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Loging successfully",
        data: {
            accessToken: accessToken,
            needChangePassword: result.needPasswordChange
        }
    })
})
const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const {refreshToken} = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Loging successfully",
        data: result
    })
})
export const AuthController = { loginUser, refreshToken }
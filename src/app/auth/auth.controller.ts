import { Request, Response } from "express";
import catchAsync from "../../Shared/catchAsync";
import { AuthServices } from "./auth.services";
import sendResponse from "../../Shared/sendResponse";
import status from "http-status";
import setCookie from "../../healper/cookieHelper";
import config from "../config";


const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.loginUser(req.body);
    const { refreshToken, accessToken } = result;
    setCookie(res, "accessToken", accessToken,Number(config.cookie.access_cookie_expire))
    setCookie(res, "refreshToken", refreshToken,Number(config.cookie.refersh_cookie_expire))
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
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);
    setCookie(res,"accessToken",result.accessToken,Number(config.cookie.access_cookie_expire))
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Access Token refresh successfully",
        data: result
    })
})
const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await AuthServices.changePassword(req.user, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Password change successfully",
        data: result
    })
})
const forgetPassword = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthServices.forgetPassword(req.body);
    setCookie(res, "accessToken", result.data,Number(config.cookie.access_cookie_expire));
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Email sent successfully",
        data: null
    })

})
const resetPassword = catchAsync(async (req: Request, res: Response) => {
    await AuthServices.resetPassword(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Reset password successfully",
        data: null
    })

})
export const AuthController = { loginUser, refreshToken, changePassword, forgetPassword, resetPassword }
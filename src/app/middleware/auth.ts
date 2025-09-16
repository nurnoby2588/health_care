import { NextFunction, Request, Response } from "express"
import { jwtHelper } from "../../healper/jwtHelper"
import config from "../config"
import { Secret } from "jsonwebtoken"
import ApiError from "../errors/ApiError"
import status from "http-status"

const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            // const token = req.headers.authorization?.split(' ')[1]
            const token = req.cookies.accessToken
            if (!token) {
                throw new ApiError(status.UNAUTHORIZED ,"You are not authorized, you token not found ")
            }
            const verifyUser = jwtHelper.verifyToken(token, config.jwt.access_token_key as Secret)
            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new ApiError(status.FORBIDDEN,"Forbidden Access")
            }
            req.user = verifyUser
            next()
        } catch (error) {
            next(error)
        }
    }
}
export default auth;
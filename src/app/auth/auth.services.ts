import { jwtHelper } from "../../healper/jwtHelper";
import prisma from "../../Shared/prisma";
import * as bcrypt from 'bcrypt'
import { UserStatus } from "../../generated/prisma";
import config from "../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import status from "http-status";
import emailSender from "./emailSernder";
import { passwordHelper } from "../../healper/passwordHashHepler";

const loginUser = async (payload: { email: string, password: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const match: boolean = await bcrypt.compare(payload.password, userData.password);
    if (!match) {
        throw new ApiError(status.UNAUTHORIZED, "Password Incorect")
    }
    const data = {
        id: userData.id,
        email: userData.email,
        role: userData.role
    }
    const accessToken = jwtHelper.generateToken(data, config.jwt.access_token_key as Secret, config.jwt.access_token_expire as string)
    const refreshToken = jwtHelper.generateToken(data, config.jwt.refresh_token_key as Secret, config.jwt.refresh_token_expire as string)
    return { accessToken, refreshToken, needPasswordChange: userData.needPasswordChange }
}

const refreshToken = async (refreshToken: string) => {
    const decodeToken = jwtHelper.verifyToken(refreshToken, config.jwt.refresh_token_key as Secret);
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: decodeToken.id,
            status: UserStatus.ACTIVE
        }
    })
    const data = {
        id: userData.id,
        email: userData.email,
        role: userData.role
    }
    const accessToken = jwtHelper.generateToken(data, config.jwt.access_token_key as Secret, config.jwt.access_token_expire as string)
    return { accessToken, needPasswordChange: userData.needPasswordChange }

}
const changePassword = async (user: any, payload: { oldPassword: string, newPassword: string }) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: user.id,
            status: UserStatus.ACTIVE
        }
    })
    const match: boolean = await bcrypt.compare(payload.oldPassword, userData.password);
    if (!match) {
        throw new ApiError(status.UNAUTHORIZED, "Password Incorect")
    }
    const hashedPasswod = await bcrypt.hash(payload.newPassword, 12)
    await prisma.user.update({
        where: {
            id: user.id,
            status: UserStatus.ACTIVE
        },
        data: {
            password: hashedPasswod,
            needPasswordChange: false
        }
    })
    return {
        message: "Password change successflly"
    }

}
const forgetPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })
    const data = {
        id: userData.id,
        email: userData.email,
        role: userData.role
    }
    const resetPassToken = jwtHelper.generateToken(data, config.jwt.forget_pass_access_token_key as Secret,
        config.jwt.forget_pass_access_token_expire as string)

    const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`
    emailSender(userData.email, "Password Reset",
        `
        <div>
        <h2>Password Reset Link</h2>
        <a href=${resetPassLink} target="_blank">
        <button>Reset Password</button>
        </a>
        </div>
        `
    )
    return {
        data: resetPassToken
    }
}
const resetPassword = async (payload: { id: string, password: string }) => {
    await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    })
    const hashedPasswod = await passwordHelper.hashedPassword(payload.password)
    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password: hashedPasswod
        }
    })

}

export const AuthServices = { loginUser, refreshToken, changePassword, forgetPassword, resetPassword }
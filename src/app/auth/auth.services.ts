import { email } from "zod";
import { jwtHelper } from "../../healper/jwtHelper";
import prisma from "../../Shared/prisma";
import * as bcrypt from 'bcrypt'
import { UserStatus } from "../../generated/prisma";
import config from "../config";
import { Secret } from "jsonwebtoken";

const loginUser = async (payload: { email: string, password: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const match: boolean = await bcrypt.compare(payload.password, userData.password);
    if (!match) {
        throw new Error("Password Incorect")
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

export const AuthServices = { loginUser, refreshToken }
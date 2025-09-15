import { email } from "zod";
import { jwtHelper } from "../../healper/jwtHelper";
import prisma from "../../Shared/prisma";
import * as bcrypt from 'bcrypt'
import { UserStatus } from "../../generated/prisma";

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
    const accessToken = jwtHelper.generateToken(data, "abc", '1h')
    const refreshToken = jwtHelper.generateToken(data, "refreshSecret", '7d')
    return { accessToken, refreshToken, needPasswordChange: userData.needPasswordChange }
}

const refreshToken = async (refreshToken: string) => {
    const decodeToken = jwtHelper.verifyToken(refreshToken, "refreshSecret") 
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
    const accessToken = jwtHelper.generateToken(data, "abc", '1h')
    return { accessToken, needPasswordChange: userData.needPasswordChange }

}

export const AuthServices = { loginUser, refreshToken }
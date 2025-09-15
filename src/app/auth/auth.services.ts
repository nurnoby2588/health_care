import { jwtHelper } from "../../healper/jwtHelper";
import prisma from "../../Shared/prisma";
import * as bcrypt from 'bcrypt'

const loginUser = async (payload: { email: string, password: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email
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

const refreshToken = async(refreshToken: string)=>{
    console.log({refreshToken})
}

export const AuthServices = { loginUser, refreshToken }
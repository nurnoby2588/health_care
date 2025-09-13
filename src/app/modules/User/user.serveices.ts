import { UserRole } from "../../../generated/prisma"
import prisma from "../../../Shared/prisma";
const bcrypt = require('bcrypt');

const createAdmin = async (data: any) => {
    const hashedPasswod = await bcrypt.hash(data.password, 12)
    const userData = {
        email: data.admin.email,
        password: hashedPasswod,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        })

        const createAdmin = await transactionClient.admin.create({
            data: data.admin
        })
        return createAdmin
    })
    return result
}

export const userServices = {
    createAdmin
}


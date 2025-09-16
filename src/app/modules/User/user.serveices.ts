import { UserRole } from "../../../generated/prisma"
import { fileUploader } from "../../../healper/fileUploder";
import prisma from "../../../Shared/prisma";
import * as bcrypt from 'bcrypt'

const createAdmin = async (req: any) => {
    const file  = req.file
    if (file) {
        const uploadCloudinary = await fileUploader.CloudinaryUpload(file)
        req.body.admin.profilePhoto = uploadCloudinary.secure_url
    }

    const hashedPasswod = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.admin.email,
        password: hashedPasswod,
        role: UserRole.ADMIN
    }
    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        })

        const createAdmin = await transactionClient.admin.create({
            data: req.body.admin
        })
        return createAdmin
    })
    return result
}

export const userServices = {
    createAdmin
}


import { Request } from "express";
import { Admin, Doctor, Patient, Prisma, UserRole, UserStatus } from "../../../generated/prisma"
import { fileUploader } from "../../../healper/fileUploder";
import prisma from "../../../Shared/prisma";
import * as bcrypt from 'bcrypt'
import { IFile } from "../../interface/file";
import { searchAbleField } from "./user.constant";
import { paginationHelper } from "../../../healper/paginationHelper";
import { IPagination } from "../../interface/pagination";
import { IUserFilterRequest } from "./user.interface";
import { tr } from "zod/v4/locales";
import { CLIENT_RENEG_LIMIT } from "tls";

const createAdmin = async (req: Request): Promise<Admin> => {
    const file = req.file as IFile
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
const createDoctor = async (req: Request): Promise<Doctor> => {
    const file = req.file as IFile
    if (file) {
        const uploadCloudinary = await fileUploader.CloudinaryUpload(file)
        req.body.doctor.profilePhoto = uploadCloudinary.secure_url
    }

    const hashedPasswod = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.doctor.email,
        password: hashedPasswod,
        role: UserRole.DOCTOR
    }
    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        })

        const createDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        })
        return createDoctorData
    })
    return result
}
const createPatient = async (req: Request): Promise<Patient> => {
    const file = req.file as IFile
    if (file) {
        const uploadCloudinary = await fileUploader.CloudinaryUpload(file)
        req.body.patient.profilePhoto = uploadCloudinary.secure_url
    }

    const hashedPasswod = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.patient.email,
        password: hashedPasswod,
        role: UserRole.PATIENT
    }
    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        })

        const createDoctorData = await transactionClient.patient.create({
            data: req.body.patient
        })
        return createDoctorData
    })
    return result
}

const getUsersFromDB = async (query: IUserFilterRequest, options: IPagination) => {
    const { searchTerm, ...filterData } = query
    const { skip, limit, sortBy, sortOrder, page } = paginationHelper.calculatePagination(options)
    const andCondition: Prisma.UserWhereInput[] = []
    if (query.searchTerm) {
        andCondition.push({
            OR: searchAbleField.map(field => ({
                [field]: {
                    contains: query.searchTerm,
                    mode: 'insensitive',
                },
            }))

        })
    }
    // andCondition.push({
    //     role: UserRole.PATIENT,
    //     status: UserStatus.ACTIVE
    // })

    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }
    // andCondition.push({
    //     role:{
    //         equals:UserRole.PATIENT
    //     }
    // })
    const whereConditon: Prisma.UserWhereInput = { AND: andCondition }
    const result = await prisma.user.findMany({
        where: whereConditon,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            needPasswordChange: true,
            createdAt: true,
            updatedAt: true,
            doctor: true,
            patient: true,
            admin: true
        }
    })

    const total = await prisma.user.count({
        where: whereConditon
    })
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
}

const changeProfileStatus = async (id: string, status: UserRole) => {
    console.log({ id }, { status })
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    })
    const updetedStatus = prisma.user.update({
        where: {
            id
        },
        data: status
    })
    return updetedStatus
}

const myProfile = async (user: any) => {
    let profileInfo;
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            id: user.id
        },
        select: {
            id: true,
            email: true,
            status: true,
            needPasswordChange: true,
            role: true,
        }
    })
    if (userInfo.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.findUniqueOrThrow({
            where: {
                email: userInfo.email
            }
        })
    }
    else if (userInfo.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.findUniqueOrThrow({
            where: {
                email: userInfo.email
            }
        })
    }
    else if (userInfo.role === UserRole.DOCTOR) {
        profileInfo = await prisma.doctor.findUniqueOrThrow({
            where: {
                email: userInfo.email
            }
        })
    }
    else if (userInfo.role === UserRole.PATIENT) {
        profileInfo = await prisma.patient.findUniqueOrThrow({
            where: {
                email: userInfo.email
            }
        })
    }
    return {...userInfo,...profileInfo}
}

export const userServices = {
    createAdmin, createDoctor, createPatient, getUsersFromDB, changeProfileStatus, myProfile
}


import { Request } from "express";
import { Admin, Doctor, Patient, UserRole } from "../../../generated/prisma"
import { fileUploader } from "../../../healper/fileUploder";
import prisma from "../../../Shared/prisma";
import * as bcrypt from 'bcrypt'
import { IFile } from "../../interface/file";

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

export const userServices = {
    createAdmin, createDoctor, createPatient
}


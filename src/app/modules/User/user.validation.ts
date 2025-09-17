import z from "zod";
import { Gender } from "../../../generated/prisma";
import app from "../../../app";

const createAdmin = z.object({
    password: z.string().nonempty("Password is required"),
    admin: z.object({
        name: z.string().nonempty("Name is required"),
        email: z.string().nonempty("Email is required"),
        contactNumber: z.string().nonempty("ContactNumber is required")
    })
})

const createDoctor = z.object({
    password: z.string().nonempty("Password is required"),
    doctor: z.object({
        name: z.string().nonempty("Name is required"),
        email: z.string().nonempty("Email is required"),
        contactNumber: z.string().nonempty("ContactNumber is required"),
        address: z.string().optional(),
        registationNumber: z.string().nonempty("RegistationNumber is required"),
        experience: z.number().optional(),
        gender: z.enum([Gender.FEMALE, Gender.MALE]).nonoptional(),
        appointmentFee: z.number().nonoptional(),
        qualification: z.string().nonempty("Qualification is required"),
        currentWorkingPlace: z.string().nonempty("CurrentWorkingPlace is required"),
        designation: z.string().nonempty("Designation is required"),
    })
})
export const userValidation = { createAdmin, createDoctor }
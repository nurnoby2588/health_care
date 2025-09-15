import z from "zod";

const Update = z.object({
    body: z.object({
        name: z.string().optional(),
        contactNumber: z.string().optional(),
        profilePhoto: z.string().optional()
    })
})

export const adminFillterSchema = {Update}
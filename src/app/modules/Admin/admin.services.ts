import { Prisma, PrismaClient } from "../../../generated/prisma"
const prisma = new PrismaClient()
const getAllFromDB = async (params: any) => {
    // type sefty is give []
    const andCondition: Prisma.AdminWhereInput[] = []
    const adminSearchableFielda = ['name', 'email']

    // [
    //             {
    //                 name: {
    //                     contains: params.searchTerm,
    //                     //for case insensitive
    //                     mode: 'insensitive'
    //                 }
    //             },
    //             {
    //                 email: {
    //                     contains: params.searchTerm,
    //                     mode: 'insensitive'
    //                 }
    //             },
    //         ]

    if (params.searchTerm) {
        andCondition.push({
            OR: adminSearchableFielda.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }
    // console.dir(andCondition, { depth: 'infinity' })
    // where conditon want {} object type . but andCondition this array give []. that way {AND: andCondition}
    // whereConditon : Prisma.AdminWhereInput prisma type checking
    const whereConditon: Prisma.AdminWhereInput = { AND: andCondition }
    const result = await prisma.admin.findMany({
        where: whereConditon
    });
    return result
}
export const adminServies = { getAllFromDB };
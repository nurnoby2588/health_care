import { Prisma, PrismaClient } from "../../../generated/prisma"
import { adminSearchableField } from "./admin.constant"
const prisma = new PrismaClient()
const getAllFromDB = async (params: any, options: any) => {
    const { limit, page } = options;
    //distracture params. saperate searchTerm from params
    const { searchTerm, ...filterData } = params
    // type sefty is give []
    const andCondition: Prisma.AdminWhereInput[] = []

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
            OR: adminSearchableField.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }
    if (Object.keys(filterData).length > 0) {

        andCondition.push({
            // transfer object to array using Object.keys()
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    }
    // console.dir(andCondition, { depth: 'infinity' })
    // where conditon want {} object type . but andCondition this array give []. that way {AND: andCondition}
    // whereConditon : Prisma.AdminWhereInput prisma type checking
    const whereConditon: Prisma.AdminWhereInput = { AND: andCondition }
    const result = await prisma.admin.findMany({
        where: whereConditon,
        skip: (Number(page) - 1) * limit,
        take: Number(limit)

    });
    return result
}
export const adminServies = { getAllFromDB };

/**
 * pagination rule
 * skip: (page-1)*limit
 * take: limit
*/
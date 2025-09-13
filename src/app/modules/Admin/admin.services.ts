import { Prisma } from "../../../generated/prisma"
import { paginationHelper } from "../../../healper/paginationHelper";
import prisma from "../../../Shared/prisma";
import { adminSearchableField } from "./admin.constant"



const getAllFromDB = async (params: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
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
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }

    });
    return result
}
export const adminServies = { getAllFromDB };

/**
 * pagination rule
 * skip: (page-1)*limit
 * take: limit
*/
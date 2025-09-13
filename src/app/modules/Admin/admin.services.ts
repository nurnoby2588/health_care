import { Admin, Prisma } from "../../../generated/prisma"
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
    const total = await prisma.admin.count({
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
const getDataByIdFromDB = async (id: string) => {
    const result = await prisma.admin.findUnique({
        where: {
            id
        }
    })
    return result
}
const updateDataByIdFromDB = async (id: string, data: Partial<Admin>) => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    })
    const result = await prisma.admin.update({
        where: {
            id
        },
        data
    });
    return result
}

const deleteDataByIdFromDB = async (id: string) => {
    await prisma.admin.findUniqueOrThrow({
        where:{
            id
        }
    })
    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeleteData = await transactionClient.admin.delete({
            where: {
                id
            }
        });
        const userDeleteData = await transactionClient.user.delete({
            where: {
                email: adminDeleteData.email
            }
        });
        return adminDeleteData
    })
    return result
}
export const adminServies = { getAllFromDB, getDataByIdFromDB, updateDataByIdFromDB, deleteDataByIdFromDB };

/**
 * pagination rule
 * skip: (page-1)*limit
 * take: limit
*/
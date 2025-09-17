import { Admin, Prisma, UserStatus } from "../../../generated/prisma"
import { paginationHelper } from "../../../healper/paginationHelper";
import prisma from "../../../Shared/prisma";
import { IPagination } from "../../interface/pagination";
import { adminSearchableField } from "./admin.constant"
import { IAdminFillterRequest } from "./admin.interface";

const getAllFromDB = async (params: IAdminFillterRequest, options: IPagination) => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
    //distracture params. saperate searchTerm from params
    const { searchTerm, ...filterData } = params
    // type sefty is give []
    const andCondition: Prisma.AdminWhereInput[] = []
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
    andCondition.push({
        isDeleted: false
    })
    if (Object.keys(filterData).length > 0) {

        andCondition.push({
            // transfer object to array using Object.keys()
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
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
const getDataByIdFromDB = async (id: string) : Promise<Admin | null> => {
    const result = await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })
    return result
}
const updateDataByIdFromDB = async (id: string, data: Partial<Admin>) : Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
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

const deleteDataByIdFromDB = async (id: string) : Promise<Admin> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    })
    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeleteData = await transactionClient.admin.delete({
            where: {
                id
            }
        });
       await transactionClient.user.delete({
            where: {
                email: adminDeleteData.email
            }
        });
        return adminDeleteData
    })
    return result
}

const softDeleteDataByIdFromDB = async (id: string) :Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })
    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeleteData = await transactionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });
        await transactionClient.user.update({
            where: {
                email: adminDeleteData.email
            }, data: {
                status: UserStatus.DELETED
            }
        });
        return adminDeleteData
    })
    return result
}
export const adminServies = { getAllFromDB, getDataByIdFromDB, updateDataByIdFromDB, deleteDataByIdFromDB, softDeleteDataByIdFromDB };

/**
 * pagination rule
 * skip: (page-1)*limit
 * take: limit
*/
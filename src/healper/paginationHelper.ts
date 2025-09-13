type Ioption = {
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string
}
type IoptionReturn = {
    page: number,
    limit: number,
    skip: number
    sortBy: string,
    sortOrder: string
}
const calculatePagination = (options: Ioption): IoptionReturn => {

    const page = Number(options.page) || 1
    const limit = Number(options.limit) || 10
    const sortBy = options.sortBy || 'createdAt'
    const sortOrder = options.sortOrder || 'desc'
    const skip = (page - 1) * limit

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }

}

export const paginationHelper = { calculatePagination }
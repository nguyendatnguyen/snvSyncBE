interface ServiceResult<T> {
    status: "success" | "error",
    data: T | any,
    pagination?: Pagination
}
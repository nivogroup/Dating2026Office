export type Pagination = {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export type Paginatedresult<T> = {
    items: T[];
    metaData: Pagination;
}
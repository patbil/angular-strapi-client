export interface StrapiPaginationRequest {
   page?: number;
   pageSize?: number;
   start?: number;
   limit?: number;
   withCount?: boolean;
}

export interface StrapiPagination {
   page: number;
   pageSize: number;
   pageCount: number;
   total: number;
}

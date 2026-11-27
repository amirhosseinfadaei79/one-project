export interface PaginationResponse<T> {
  data: T[];
  totalRecord: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export function buildPaginationResponse<T>(
  data: T[],
  total: number,
  currentPage: number,
  pageSize: number,
): PaginationResponse<T> {
  return {
    data,
    totalRecord: total,
    currentPage,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
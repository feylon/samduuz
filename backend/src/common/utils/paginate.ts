export interface Paginated<T> {
  items: T[];
  meta: {
    totalCount: number;
    page: number;
    totalPages: number;
    pageSize: number;
  };
}

export const toPaginated = <T>(
  items: T[],
  totalCount: number,
  page: number,
  pageSize: number,
): Paginated<T> => ({
  items,
  meta: {
    totalCount,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
  },
});

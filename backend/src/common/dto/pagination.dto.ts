/**
 * Pagination request parameters
 */
export class PaginationQueryDto {
  page: number = 1;
  limit: number = 20;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}

/**
 * Generic paginated response wrapper
 */
export class PaginatedResponseDto<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  constructor(data: T[], page: number, limit: number, total: number) {
    this.data = data;
    this.pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}

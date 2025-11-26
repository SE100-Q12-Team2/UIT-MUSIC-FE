export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T = any> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

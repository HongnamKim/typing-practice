// 공통 API 응답 타입
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}

// 페이지네이션 응답 타입
export interface PageResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
}

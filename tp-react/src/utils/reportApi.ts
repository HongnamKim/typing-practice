import apiClient from './apiClient';
import {ApiResponse, PageResponse} from '../types/api.types';

// 신고 타입
interface Report {
    reportId: number;
    quoteId: number;
    quoteSentence: string;
    reason: 'MODIFY' | 'DELETE';
    detail: string;
    status: 'PENDING' | 'PROCESSED';
    createdAt: string;
}

// 파라미터 타입
interface CreateReportData {
    quoteId: number;
    reason: 'MODIFY' | 'DELETE';
    detail: string;
}

interface GetMyReportsParams {
    page?: number;
    size?: number;
    status?: 'PENDING' | 'PROCESSED';
}

/**
 * 문장 신고
 */
export const createReport = async (data: CreateReportData) => {
    return apiClient.post<ApiResponse<Report>>('/reports', data);
};

/**
 * 내 신고 목록 조회
 */
export const getMyReports = async (params: GetMyReportsParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.size) queryParams.append('size', String(params.size));
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    return apiClient.get<ApiResponse<PageResponse<Report>>>(`/reports/my${queryString ? `?${queryString}` : ''}`);
};

/**
 * 내 신고 삭제
 */
export const deleteReport = async (reportId: number) => {
    return apiClient.delete<ApiResponse<void>>(`/reports/${reportId}`);
};

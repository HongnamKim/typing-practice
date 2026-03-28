import apiClient from './apiClient';
import {ApiResponse, PageResponse} from '../types/api.types';

// 문장 타입
interface Quote {
    id: number;
    sentence: string;
    author?: string;
    type: 'PUBLIC' | 'PRIVATE';
    status: 'PENDING' | 'ACTIVE';
    createdAt: string;
    updatedAt: string;
}

// 파라미터 타입
interface GetQuotesParams {
    page?: number;
    count?: number;
    seed?: number;
    onlyMyQuotes?: boolean;
}

interface GetMyQuotesParams {
    page?: number;
    size?: number;
    type?: 'PUBLIC' | 'PRIVATE';
    status?: 'PENDING' | 'ACTIVE';
}

interface UpdateQuoteData {
    sentence?: string;
    author?: string;
}

type QuoteType = 'public' | 'private';

/**
 * 공개 문장 랜덤 조회
 */
export const getQuotes = async (params: GetQuotesParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.count) queryParams.append('count', String(params.count));
    if (params.seed !== undefined) queryParams.append('seed', String(params.seed));
    if (params.onlyMyQuotes) queryParams.append('onlyMyQuotes', String(params.onlyMyQuotes));

    const queryString = queryParams.toString();
    return apiClient.get<ApiResponse<PageResponse<Quote>>>(`/quotes${queryString ? `?${queryString}` : ''}`);
};

/**
 * 공개 문장 업로드
 */
const uploadPublicQuote = async (sentence: string, author?: string) => {
    const body: { sentence: string; author?: string; language: string } = {sentence, language: 'KOREAN'};
    if (author) {
        body.author = author;
    }
    return apiClient.post<ApiResponse<Quote>>('/quotes/public', body);
};

/**
 * 비공개 문장 업로드
 */
const uploadPrivateQuote = async (sentence: string, author?: string) => {
    const body: { sentence: string; author?: string; language: string } = {sentence, language: 'KOREAN'};
    if (author) {
        body.author = author;
    }
    return apiClient.post<ApiResponse<Quote>>('/quotes/private', body);
};

/**
 * 문장 업로드 (타입에 따라 분기)
 */
export const uploadQuote = async (type: QuoteType, sentence: string, author?: string) => {
    if (type === 'public') {
        return uploadPublicQuote(sentence, author);
    }
    return uploadPrivateQuote(sentence, author);
};

/**
 * 내 문장 목록 조회
 */
export const getMyQuotes = async (params: GetMyQuotesParams = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.size) queryParams.append('size', String(params.size));
    if (params.type) queryParams.append('type', params.type);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    return apiClient.get<ApiResponse<PageResponse<Quote>>>(`/quotes/my${queryString ? `?${queryString}` : ''}`);
};

/**
 * 비공개 문장 수정
 */
export const updateQuote = async (quoteId: number, data: UpdateQuoteData) => {
    return apiClient.patch<ApiResponse<Quote>>(`/quotes/${quoteId}`, data);
};

/**
 * 비공개 문장 삭제
 */
export const deleteQuote = async (quoteId: number) => {
    return apiClient.delete<ApiResponse<void>>(`/quotes/${quoteId}`);
};

/**
 * 비공개 → 공개 전환 요청
 */
export const publishQuote = async (quoteId: number) => {
    return apiClient.post<ApiResponse<Quote>>(`/quotes/${quoteId}/publish`);
};

/**
 * 공개 전환 취소
 */
export const cancelPublishQuote = async (quoteId: number) => {
    return apiClient.post<ApiResponse<Quote>>(`/quotes/${quoteId}/cancel-publish`);
};

/**
 * 문장 관련 API 에러에서 사용자에게 보여줄 메시지를 추출한다.
 * 유사 문장 에러(409)인 경우 similarMessage를 반환한다.
 */
export const extractQuoteErrorMessage = (error: any, similarMessage: string, fallbackMessage: string): string => {
    const data = error.response?.data;
    if (!data?.detail) return fallbackMessage;

    // 유사 문장 에러: 호출측에서 제공한 context 메시지 사용
    if (data.similarSentence !== undefined) {
        return similarMessage;
    }

    // 동일 문장 등 기타 에러: 서버 메시지 사용
    return data.detail;
};

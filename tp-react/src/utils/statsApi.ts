import apiClient from './apiClient';
import {ApiResponse} from '../types/api.types';

// 종합 통계 응답
export interface TypingStatsResponse {
    totalAttempts: number;
    avgCpm: number;
    avgAcc: number;
    bestCpm: number;
    totalPracticeTimeMin: number;
    totalResetCount: number;
}

// 일별 통계 항목
export interface DayEntry {
    date: string;
    attempts: number;
    avgCpm: number;
    avgAcc: number;
    bestCpm: number;
    resetCount: number;
    practiceTimeMin: number;
}

// 일별 통계 응답
export interface DailyStatsResponse {
    days: number;
    content: DayEntry[];
}

// 오타 항목
export interface TypoStatsEntry {
    language: string;
    expected: string;
    count: number;
}

// 오타 통계 응답
export interface TypoStatsResponse {
    content: TypoStatsEntry[];
}

// 오타 상세 항목
export interface TypoDetailEntry {
    language: string;
    expected: string;
    actual: string;
    typoCount: number;
    initialCount: number;
    medialCount: number;
    finalCount: number;
    letterCount: number;
}

// 오타 상세 응답
export interface TypoDetailStatsResponse {
    content: TypoDetailEntry[];
}

type Language = 'KOREAN' | 'ENGLISH';

/**
 * 종합 타이핑 통계 조회
 */
export const getTypingStats = async (language: Language) => {
    return apiClient.get<ApiResponse<TypingStatsResponse>>(
        `/members/me/stats/typing?language=${language}`
    );
};

/**
 * 일별 타이핑 추이 조회
 */
export const getDailyStats = async (language: Language, days: number = 7) => {
    return apiClient.get<ApiResponse<DailyStatsResponse>>(
        `/members/me/stats/daily?language=${language}&days=${days}`
    );
};

/**
 * 오타 상위 10개 조회
 */
export const getTypoStats = async (language: Language) => {
    return apiClient.get<ApiResponse<TypoStatsResponse>>(
        `/members/me/stats/typos?language=${language}`
    );
};

/**
 * 오타 상세 조회 (drill-down)
 */
export const getTypoDetailStats = async (language: Language, expected: string) => {
    return apiClient.get<ApiResponse<TypoDetailStatsResponse>>(
        `/members/me/stats/typos/detail?language=${language}&expected=${encodeURIComponent(expected)}`
    );
};

/**
 * 통계 리프레시 (1분 쿨다운)
 */
export const refreshStats = async (language: Language) => {
    return apiClient.post<ApiResponse<TypingStatsResponse>>(
        `/members/me/stats/refresh?language=${language}`
    );
};

import apiClient from './apiClient';
import {ApiResponse} from '../types/api.types';
import {Language} from '@/const/config.const';

// 누적 통계 응답
export interface WordTypingStatsResponse {
    totalAttempts: number;
    totalWordsAttempted: number;
    avgWpm: number;
    avgAcc: number;
    bestWpm: number;
    totalPracticeTimeMin: number;
}

// 일별 통계 항목
export interface WordDailyStatsEntry {
    date: string;
    attempts: number;
    wordsAttempted: number;
    avgWpm: number;
    avgAcc: number;
    bestWpm: number;
    practiceTimeMin: number;
}

export interface WordDailyStatsResponse {
    days: number;
    content: WordDailyStatsEntry[];
}

// 자주 틀리는 글자
export interface WordTypoStatsEntry {
    language: Language;
    expected: string;
    count: number;
}

export interface WordTypoStatsResponse {
    content: WordTypoStatsEntry[];
}

// 특정 글자 오타 분포
export interface WordTypoDetailStatsEntry {
    language: Language;
    expected: string;
    actual: string;
    typoCount: number;
    initialCount: number;
    medialCount: number;
    finalCount: number;
    letterCount: number;
}

export interface WordTypoDetailStatsResponse {
    content: WordTypoDetailStatsEntry[];
}

/**
 * 누적 통계 조회
 */
export const getWordTypingStats = async (language: Language) => {
    return apiClient.get<ApiResponse<WordTypingStatsResponse>>(
        `/members/me/word-stats/typing?language=${language}`
    );
};

/**
 * 일별 통계 조회
 */
export const getWordDailyStats = async (language: Language, days: number = 7) => {
    return apiClient.get<ApiResponse<WordDailyStatsResponse>>(
        `/members/me/word-stats/daily?language=${language}&days=${days}`
    );
};

/**
 * 자주 틀리는 글자 Top 10
 */
export const getWordTypoStats = async (language: Language) => {
    return apiClient.get<ApiResponse<WordTypoStatsResponse>>(
        `/members/me/word-stats/typos?language=${language}`
    );
};

/**
 * 특정 글자의 오타 분포 조회
 */
export const getWordTypoDetailStats = async (language: Language, expected: string) => {
    const params = new URLSearchParams({language, expected});
    return apiClient.get<ApiResponse<WordTypoDetailStatsResponse>>(
        `/members/me/word-stats/typos/detail?${params.toString()}`
    );
};

/**
 * 통계 강제 갱신 (1분 쿨다운)
 */
export const refreshWordStats = async (language: Language) => {
    return apiClient.post<ApiResponse<WordTypingStatsResponse>>(
        `/members/me/word-stats/refresh?language=${language}`
    );
};

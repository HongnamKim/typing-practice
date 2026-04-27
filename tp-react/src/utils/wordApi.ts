import apiClient from './apiClient';
import {ApiResponse} from '../types/api.types';
import {Language} from '@/const/config.const';

export type WordDifficultyTier = 'RANDOM' | 'EASY' | 'NORMAL' | 'HARD';

export interface WordResponse {
    wordId: number;
    word: string;
    difficulty: number;
}

interface GetWordsParams {
    language: Language;
    difficulty?: WordDifficultyTier;
    count?: number;
}

/**
 * 타이핑 연습용 단어 목록 조회
 */
export const getWords = async (params: GetWordsParams) => {
    const queryParams = new URLSearchParams();
    queryParams.append('language', params.language);
    if (params.difficulty) queryParams.append('difficulty', params.difficulty);
    if (params.count !== undefined) queryParams.append('count', String(params.count));

    return apiClient.get<ApiResponse<WordResponse[]>>(`/words?${queryParams.toString()}`, {
        timeout: 2000,
    });
};

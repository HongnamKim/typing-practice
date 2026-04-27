import apiClient from './apiClient';
import {ApiResponse} from '../types/api.types';
import {Language} from '@/const/config.const';
import {WordDifficultyTier} from './wordApi';

export type WordTypoType = 'INITIAL' | 'MEDIAL' | 'FINAL' | 'LETTER';

export interface WordTypo {
    expected: string;
    actual: string;
    position?: number;
    type: WordTypoType;
}

export interface WordDetailRequest {
    wordIndex: number;
    wordId: number;
    word: string;
    typed?: string;
    correct?: boolean;
    timeMs?: number;
    typos?: WordTypo[];
}

export interface WordTypingRecordRequest {
    language: Language;
    difficulty: WordDifficultyTier;
    wordCount: number;
    anonymousId?: string | null;
    wpm: number;
    accuracy: number;
    correctWordCount: number;
    incorrectWordCount: number;
    elapsedTimeMs: number;
    wordIds?: number[];
    wordDetails?: WordDetailRequest[];
}

/**
 * 단어 타이핑 기록 저장
 */
export const saveWordTypingRecord = async (payload: WordTypingRecordRequest) => {
    return apiClient.post<ApiResponse<null>>('/word-typing-records', payload);
};

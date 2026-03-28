import apiClient from './apiClient';

export type TypoType = 'INITIAL' | 'MEDIAL' | 'FINAL' | 'LETTER';

export interface TypoEntry {
    expected: string;
    actual: string;
    position: number;
    type: TypoType;
}

interface TypingRecordRequest {
    quoteId: number;
    cpm: number;
    accuracy: number;
    charLength: number;
    resetCount: number;
    typos: TypoEntry[];
}

/**
 * 타이핑 기록 저장
 * 비로그인 사용자도 호출 가능 (로그인 시 개인 통계 반영)
 */
export const saveTypingRecord = async (request: TypingRecordRequest) => {
    return apiClient.post('/typing-records', request);
};

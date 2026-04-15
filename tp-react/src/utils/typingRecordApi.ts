import apiClient from './apiClient';
import {buildTracking, TrackingInfo} from './tracking';
import {ServingType} from './quoteApi';

export type TypoType = 'INITIAL' | 'MEDIAL' | 'FINAL' | 'LETTER';

export interface TypoEntry {
    expected: string;
    actual: string;
    position: number;
    type: TypoType;
    wordIndex?: number;
}

interface TypingRecordRequest {
    quoteId: number;
    cpm: number;
    accuracy: number;
    charLength: number;
    resetCount: number;
    typos: TypoEntry[];
    servingType: ServingType;
    anonymousId?: string | null;
    tracking?: TrackingInfo;
}

/**
 * 타이핑 기록 저장
 * 비로그인 사용자도 호출 가능 (로그인 시 개인 통계 반영)
 */
export const saveTypingRecord = async (request: TypingRecordRequest) => {
    const tracking = buildTracking();
    return apiClient.post('/typing-records', {
        ...request,
        ...(tracking && {tracking}),
    });
};

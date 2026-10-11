import React from 'react';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {getAllTypoStats, getDailyStats, getTypingStats} from '../src/utils/statsApi';
import {getAllWordTypoStats, getWordDailyStats, getWordTypingStats} from '../src/utils/wordStatsApi';
import Stats from '../src/pages/Stats/Stats';

vi.mock('../src/Context/AuthContext', () => {
    const user = {id: 1};
    return {useAuth: () => ({user, isInitialized: true})};
});
vi.mock('../src/Context/ErrorContext', () => {
    const value = {showError: () => {}};
    return {useError: () => value};
});
vi.mock('react-router-dom', () => {
    const navigate = () => {};
    return {useNavigate: () => navigate};
});
vi.mock('../src/utils/statsApi', () => ({
    getTypingStats: vi.fn(),
    getDailyStats: vi.fn(),
    getAllTypoStats: vi.fn(),
    getTypoDetailStats: vi.fn(),
    refreshStats: vi.fn(),
}));
vi.mock('../src/utils/wordStatsApi', () => ({
    getWordTypingStats: vi.fn(),
    getWordDailyStats: vi.fn(),
    getAllWordTypoStats: vi.fn(),
    getWordTypoDetailStats: vi.fn(),
    refreshWordStats: vi.fn(),
}));
// 요약 카드와 차트는 이 테스트와 관계없어서 비운다 (recharts 는 jsdom 에서 크기를 잴 수 없다)
vi.mock('../src/pages/Stats/components/StatsSummary', () => ({default: () => null}));
vi.mock('../src/pages/Stats/components/WordStatsSummary', () => ({default: () => null}));
vi.mock('../src/pages/Stats/components/DailyChart', () => ({default: () => null}));
vi.mock('../src/pages/Stats/components/WordDailyChart', () => ({default: () => null}));

const ok = (data) => ({data: {data}});

const keyCount = (label) => {
    const key = screen.getByText(label, {selector: '.heatmap-key, .heatmap-space-key'});
    return parseInt(key.querySelector('.heatmap-key-tooltip').textContent, 10);
};

beforeEach(() => {
    localStorage.clear();
    getTypingStats.mockResolvedValue(ok({}));
    getDailyStats.mockResolvedValue(ok({days: 7, content: []}));
    getAllTypoStats.mockResolvedValue(ok({
        content: {language: 'KOREAN', typos: [{expected: 'ㅇ', count: 120}, {expected: 'ㅏ', count: 85}]},
    }));
    getWordTypingStats.mockResolvedValue(ok({}));
    getWordDailyStats.mockResolvedValue(ok({days: 7, content: []}));
    getAllWordTypoStats.mockResolvedValue(ok({
        content: {language: 'KOREAN', typos: [{expected: 'ㅁ', count: 9}]},
    }));
});

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

describe('Stats 오타 통계', () => {
    it('문장 모드: /typos/all 을 한 번만 불러서 자주 틀리는 글자 목록과 히트맵에 같이 쓴다', async () => {
        render(<Stats/>);

        await waitFor(() => expect(keyCount('ㅇ')).toBe(120));
        expect(getAllTypoStats).toHaveBeenCalledTimes(1);
        expect(getAllTypoStats).toHaveBeenCalledWith('KOREAN');
        expect([...document.querySelectorAll('.typo-char')].map(el => el.textContent)).toEqual(['ㅇ', 'ㅏ']);
    });

    it('단어 모드로 바꾸면 단어 모드 /typos/all 을 한 번 부른다', async () => {
        render(<Stats/>);
        await waitFor(() => expect(keyCount('ㅇ')).toBe(120));

        fireEvent.click(screen.getByRole('button', {name: 'Word'}));

        await waitFor(() => expect(keyCount('ㅁ')).toBe(9));
        expect(getAllWordTypoStats).toHaveBeenCalledTimes(1);
        expect(getAllWordTypoStats).toHaveBeenCalledWith('KOREAN');
    });
});

import React from 'react';
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {getTypoDetailStats} from '../src/utils/statsApi';
import KeyboardHeatmap from '../src/pages/Stats/components/KeyboardHeatmap';

vi.mock('../src/utils/statsApi', () => ({
    getTypoDetailStats: vi.fn(),
}));

// /typos/all 응답의 typos (count 내림차순)
const TYPO_STATS = [
    {expected: 'ㄲ', count: 4},
    {expected: ' ', count: 3},
    {expected: 'ㄱ', count: 3},
    {expected: 'ㅂ', count: 2},
    {expected: 'ㅏ', count: 1},
];

// /typos/detail 응답
const DETAILS = {
    'ㄱ': [{expected: 'ㄱ', actual: 'ㄷ', typoCount: 2}, {expected: 'ㄱ', actual: 'ㅅ', typoCount: 1}],
    'ㄲ': [{expected: 'ㄲ', actual: 'ㄱ', typoCount: 4}],
    'ㅂ': [{expected: 'ㅂ', actual: 'ㅈ', typoCount: 2}],
};
const detailResponse = (entries) => ({data: {data: {content: entries}}});

// 툴팁 "7회" / "7errors" 에서 숫자만 읽는다 (로딩 중에는 툴팁이 없어 실패)
const keyCount = (label) => {
    const key = screen.getByText(label, {selector: '.heatmap-key, .heatmap-space-key'});
    return parseInt(key.querySelector('.heatmap-key-tooltip').textContent, 10);
};

const clickKey = (label) =>
    fireEvent.click(screen.getByText(label, {selector: '.heatmap-key, .heatmap-space-key'}));

const detailItems = () =>
    [...document.querySelectorAll('.heatmap-detail-item')].map(item => [
        item.querySelector('.heatmap-detail-expected').textContent,
        item.querySelector('.heatmap-detail-actual').textContent,
        parseInt(item.querySelector('.heatmap-detail-count').textContent, 10),
    ]);

beforeEach(() => {
    getTypoDetailStats.mockReset();
    getTypoDetailStats.mockImplementation((language, ch) => Promise.resolve(detailResponse(DETAILS[ch] || [])));
});

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
});

describe('KeyboardHeatmap (통계 페이지)', () => {
    it('글자별 횟수로 키를 표시하고, 렌더링만으로는 API 를 호출하지 않는다', () => {
        render(<KeyboardHeatmap typoStats={TYPO_STATS}/>);

        expect(keyCount('ㄱ')).toBe(7);
        expect(keyCount('Space')).toBe(3);
        expect(keyCount('ㅏ')).toBe(1);
        expect(keyCount('ㄴ')).toBe(0);
        expect(getTypoDetailStats).not.toHaveBeenCalled();
    });

    it('키를 누르면 오타가 있는 글자만 상세를 조회해서 많은 순으로 보여준다', async () => {
        render(<KeyboardHeatmap typoStats={TYPO_STATS}/>);

        clickKey('ㄱ');
        expect(document.querySelector('.heatmap-detail-loading')).not.toBeNull();
        await waitFor(() => expect(detailItems()).toEqual([
            ['ㄲ', 'ㄱ', 4],
            ['ㄱ', 'ㄷ', 2],
            ['ㄱ', 'ㅅ', 1],
        ]));
        expect(getTypoDetailStats.mock.calls).toEqual([['KOREAN', 'ㄱ'], ['KOREAN', 'ㄲ']]);

        // ㅂ 키의 ㅃ 은 오타가 없어서 조회하지 않는다
        clickKey('ㅂ');
        await waitFor(() => expect(detailItems()).toEqual([['ㅂ', 'ㅈ', 2]]));
        expect(getTypoDetailStats).toHaveBeenCalledTimes(3);
        expect(getTypoDetailStats).toHaveBeenLastCalledWith('KOREAN', 'ㅂ');
    });

    it('한 번 연 키는 다시 열어도 재조회하지 않는다', async () => {
        render(<KeyboardHeatmap typoStats={TYPO_STATS}/>);
        clickKey('ㄱ');
        await waitFor(() => expect(detailItems()).toHaveLength(3));

        clickKey('ㄱ'); // 닫기
        clickKey('ㄱ'); // 다시 열기

        expect(detailItems()).toHaveLength(3);
        expect(getTypoDetailStats).toHaveBeenCalledTimes(2);
    });

    it('단어 모드 조회 함수를 넘기면 그 함수로 상세를 조회한다', async () => {
        const fetchWordTypoDetail = vi.fn().mockResolvedValue(
            detailResponse([{expected: 'ㅂ', actual: 'ㅁ', typoCount: 2}])
        );
        render(<KeyboardHeatmap typoStats={TYPO_STATS} fetchTypoDetail={fetchWordTypoDetail}/>);

        clickKey('ㅂ');

        await waitFor(() => expect(detailItems()).toEqual([['ㅂ', 'ㅁ', 2]]));
        expect(fetchWordTypoDetail).toHaveBeenCalledWith('ㅂ');
        expect(getTypoDetailStats).not.toHaveBeenCalled();
    });

    it('상세 조회에 실패하면 빈 목록을 보여준다', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        getTypoDetailStats.mockRejectedValue(new Error('network'));
        render(<KeyboardHeatmap typoStats={TYPO_STATS}/>);

        clickKey('ㅂ');

        await waitFor(() => expect(document.querySelector('.heatmap-detail-loading')).toBeNull());
        expect(detailItems()).toEqual([]);
    });

    it('새로고침으로 데이터가 바뀌면 열린 상세를 닫고, 다시 열 때 새로 조회한다', async () => {
        const {rerender} = render(<KeyboardHeatmap typoStats={TYPO_STATS}/>);
        clickKey('ㅂ');
        await waitFor(() => expect(detailItems()).toHaveLength(1));

        rerender(<KeyboardHeatmap typoStats={[...TYPO_STATS]}/>);
        expect(document.querySelector('.heatmap-detail')).toBeNull();

        clickKey('ㅂ');
        await waitFor(() => expect(detailItems()).toHaveLength(1));
        expect(getTypoDetailStats).toHaveBeenCalledTimes(2);
    });

    it('로딩 중에는 키를 스켈레톤으로 보여준다', () => {
        render(<KeyboardHeatmap typoStats={[]} isLoading/>);

        expect(document.querySelectorAll('.heatmap-key-skeleton').length).toBeGreaterThan(0);
        expect(document.querySelector('.heatmap-key-tooltip')).toBeNull();
    });
});

describe('KeyboardHeatmap (타이핑 결과 화면)', () => {
    it('externalTypos 를 넘기면 API 를 호출하지 않고 상세도 직접 계산한다', () => {
        render(
            <KeyboardHeatmap
                compact
                externalTypos={[
                    {expected: 'ㄱ', actual: 'ㄷ'},
                    {expected: 'ㄱ', actual: 'ㄷ'},
                    {expected: 'ㄲ', actual: 'ㄱ'},
                ]}
            />
        );

        expect(keyCount('ㄱ')).toBe(3);
        clickKey('ㄱ');
        expect(detailItems()).toEqual([['ㄱ', 'ㄷ', 2], ['ㄲ', 'ㄱ', 1]]);
        expect(getTypoDetailStats).not.toHaveBeenCalled();
    });
});

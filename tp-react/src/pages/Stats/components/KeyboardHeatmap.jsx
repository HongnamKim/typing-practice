import {useEffect, useMemo, useState} from 'react';
import {getTypoDetailStats} from '@/utils/statsApi.ts';
import {t} from '@/utils/i18n.ts';
import './KeyboardHeatmap.css';

const KEYBOARD_ROWS = [
    [
        {label: 'ㅂ', variants: ['ㅂ', 'ㅃ']},
        {label: 'ㅈ', variants: ['ㅈ', 'ㅉ']},
        {label: 'ㄷ', variants: ['ㄷ', 'ㄸ']},
        {label: 'ㄱ', variants: ['ㄱ', 'ㄲ']},
        {label: 'ㅅ', variants: ['ㅅ', 'ㅆ']},
        {label: 'ㅛ', variants: ['ㅛ']},
        {label: 'ㅕ', variants: ['ㅕ']},
        {label: 'ㅑ', variants: ['ㅑ']},
        {label: 'ㅐ', variants: ['ㅐ', 'ㅒ']},
        {label: 'ㅔ', variants: ['ㅔ', 'ㅖ']},
    ],
    [
        {label: 'ㅁ', variants: ['ㅁ']},
        {label: 'ㄴ', variants: ['ㄴ']},
        {label: 'ㅇ', variants: ['ㅇ']},
        {label: 'ㄹ', variants: ['ㄹ']},
        {label: 'ㅎ', variants: ['ㅎ']},
        {label: 'ㅗ', variants: ['ㅗ']},
        {label: 'ㅓ', variants: ['ㅓ']},
        {label: 'ㅏ', variants: ['ㅏ']},
        {label: 'ㅣ', variants: ['ㅣ']},
    ],
    [
        {label: 'ㅋ', variants: ['ㅋ']},
        {label: 'ㅌ', variants: ['ㅌ']},
        {label: 'ㅊ', variants: ['ㅊ']},
        {label: 'ㅍ', variants: ['ㅍ']},
        {label: 'ㅠ', variants: ['ㅠ']},
        {label: 'ㅜ', variants: ['ㅜ']},
        {label: 'ㅡ', variants: ['ㅡ']},
    ],
];

const SPACE_CHAR = ' ';

const getKeyColor = (count, maxCount) => {
    if (!count || !maxCount) return {bg: 'var(--color-bg-secondary)', text: 'var(--color-text-muted)'};
    const ratio = count / maxCount;
    if (ratio > 0.7) return {bg: 'rgba(112, 73, 179, 1)', text: '#fff'};
    if (ratio > 0.5) return {bg: 'rgba(112, 73, 179, 0.6)', text: '#fff'};
    if (ratio > 0.3) return {bg: 'rgba(112, 73, 179, 0.4)', text: 'var(--color-text)'};
    if (ratio > 0.1) return {bg: 'rgba(112, 73, 179, 0.2)', text: 'var(--color-text)'};
    return {bg: 'var(--color-bg-secondary)', text: 'var(--color-text-muted)'};
};

function KeyboardHeatmap({externalTypos, compact, typoStats, isLoading, fetchTypoDetail}) {
    // 통계 페이지에서 키를 눌러 받아온 글자별 상세
    const [keyData, setKeyData] = useState({});
    const [selectedKey, setSelectedKey] = useState(null);

    // externalTypos가 있으면 useMemo로 즉시 계산
    const externalCounts = useMemo(() => {
        if (!externalTypos) return null;
        const data = {};
        const counts = {};
        for (const typo of externalTypos) {
            const ch = typo.expected;
            if (!data[ch]) data[ch] = [];
            data[ch].push(typo);
            counts[ch] = (counts[ch] || 0) + 1;
        }
        return {data, counts};
    }, [externalTypos]);

    // 통계 페이지: 글자별 오타 횟수 (/typos/all)
    const keyCounts = useMemo(() => {
        const counts = {};
        for (const entry of typoStats || []) {
            counts[entry.expected] = entry.count;
        }
        return counts;
    }, [typoStats]);

    // 새로고침으로 횟수가 바뀌면 받아둔 상세를 버리고 열린 상세를 닫는다
    useEffect(() => {
        setKeyData({});
        setSelectedKey(null);
    }, [typoStats]);

    const activeKeyData = externalTypos ? (externalCounts?.data || {}) : keyData;
    const activeKeyCounts = externalTypos ? (externalCounts?.counts || {}) : keyCounts;

    // 오타가 있는데 아직 상세를 받지 않은 글자
    const getPendingChars = (key) => key.variants.filter(v => activeKeyCounts[v] > 0 && !activeKeyData[v]);

    // 통계 페이지: 키를 처음 열 때 그 키 글자들의 상세를 조회
    const loadKeyDetails = async (key) => {
        const pending = getPendingChars(key);
        if (pending.length === 0) return;
        const fetcher = fetchTypoDetail || ((c) => getTypoDetailStats('KOREAN', c));
        const results = await Promise.all(
            pending.map(ch => fetcher(ch)
                .then(res => [ch, res.data.data.content || []])
                .catch(e => {
                    console.error('Heatmap detail load failed:', e);
                    return [ch, []];
                }))
        );
        setKeyData(prev => ({...prev, ...Object.fromEntries(results)}));
    };

    const getKeyCount = (key) => {
        return key.variants.reduce((sum, v) => sum + (activeKeyCounts[v] || 0), 0);
    };

    const getKeyDetails = (key) => {
        const entries = key.variants.flatMap(v => activeKeyData[v] || []);
        if (externalTypos) {
            // 외부 데이터: (expected, actual) 쌍별로 집계
            const grouped = {};
            for (const e of entries) {
                const k = e.expected + '→' + e.actual;
                if (!grouped[k]) grouped[k] = {expected: e.expected, actual: e.actual, typoCount: 0};
                grouped[k].typoCount += 1;
            }
            return Object.values(grouped).sort((a, b) => b.typoCount - a.typoCount);
        }
        return entries.sort((a, b) => b.typoCount - a.typoCount);
    };

    const toggleKey = (key) => {
        if (selectedKey?.label === key.label) {
            setSelectedKey(null);
            return;
        }
        setSelectedKey(key);
        if (!externalTypos) loadKeyDetails(key);
    };

    const handleKeyClick = (key) => {
        const count = getKeyCount(key);
        if (count === 0) return;
        toggleKey(key);
    };

    const handleSpaceClick = () => {
        if (!spaceCount) return;
        toggleKey({label: 'Space', variants: [SPACE_CHAR]});
    };

    const displayChar = (ch) => {
        if (ch === '' || ch === null) return '\u2205';
        if (ch === ' ') return '\u2423';
        return ch;
    };

    const allCounts = KEYBOARD_ROWS.flat().map(getKeyCount);
    const spaceCount = activeKeyCounts[SPACE_CHAR] || 0;
    const maxCount = Math.max(...allCounts, spaceCount, 1);

    return (
        <div className={`heatmap-section${compact ? ' compact' : ''}`}>
            {!compact && (
                <div className="heatmap-header">
                <h3 className="heatmap-title">{t('keyboardHeatmap')}</h3>
                <div className="heatmap-legend">
                    <span className="heatmap-legend-label">{t('accurate')}</span>
                    <div className="heatmap-legend-colors">
                        <div className="heatmap-legend-swatch" style={{background: 'var(--color-bg-secondary)'}}/>
                        <div className="heatmap-legend-swatch" style={{background: 'rgba(112, 73, 179, 0.2)'}}/>
                        <div className="heatmap-legend-swatch" style={{background: 'rgba(112, 73, 179, 0.5)'}}/>
                        <div className="heatmap-legend-swatch" style={{background: 'rgba(112, 73, 179, 0.8)'}}/>
                        <div className="heatmap-legend-swatch" style={{background: 'rgba(112, 73, 179, 1)'}}/>
                    </div>
                    <span className="heatmap-legend-label">{t('errorsLabel')}</span>
                </div>
                </div>
            )}
            <div className="heatmap-keyboard">
                {KEYBOARD_ROWS.map((row, ri) => (
                    <div key={ri} className={`heatmap-row${ri > 0 ? ` heatmap-row-${ri + 1}` : ''}`}>
                        {row.map((key) => {
                            if (isLoading) {
                                return (
                                    <div key={key.label} className="heatmap-key heatmap-key-skeleton">
                                        {key.label}
                                    </div>
                                );
                            }
                            const count = getKeyCount(key);
                            const color = getKeyColor(count, maxCount);
                            return (
                                <div key={key.label}
                                     className={`heatmap-key${selectedKey?.label === key.label ? ' selected' : ''}${count > 0 ? ' clickable' : ''}`}
                                     style={{background: color.bg, color: color.text}}
                                     onClick={() => handleKeyClick(key)}>
                                    {key.label}
                                    <span className="heatmap-key-tooltip">{count}{t('errors')}</span>
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div className="heatmap-spacebar">
                    {isLoading ? (
                        <div className="heatmap-space-key heatmap-key-skeleton">Space</div>
                    ) : (() => {
                        const color = getKeyColor(spaceCount, maxCount);
                        return (
                            <div className={`heatmap-space-key${selectedKey?.label === 'Space' ? ' selected' : ''}${spaceCount > 0 ? ' clickable' : ''}`}
                                 style={{background: color.bg, color: color.text}}
                                 onClick={handleSpaceClick}>
                                Space
                                <span className="heatmap-key-tooltip">{spaceCount}{t('errors')}</span>
                            </div>
                        );
                    })()}
                </div>
                {selectedKey && (
                        <div className="heatmap-detail">
                            <div className="heatmap-detail-header">
                                <span className="heatmap-detail-title">
                                    '{displayChar(selectedKey.label)}' {t('typoDetailTitle')}
                                </span>
                                <span className="heatmap-detail-total">{getKeyCount(selectedKey)}{t('errors')}</span>
                            </div>
                            <div className="heatmap-detail-list">
                                {getPendingChars(selectedKey).length > 0 ? (
                                    <div className="heatmap-detail-loading">{t('loading')}</div>
                                ) : getKeyDetails(selectedKey).map((entry, i) => (
                                    <div key={i} className="heatmap-detail-item">
                                        <span className="heatmap-detail-expected">{displayChar(entry.expected)}</span>
                                        <span className="heatmap-detail-arrow">{'\u2192'}</span>
                                        <span className="heatmap-detail-actual">{displayChar(entry.actual)}</span>
                                        <span className="heatmap-detail-count">{entry.typoCount}{t('errors')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
        </div>
    );
}

export default KeyboardHeatmap;
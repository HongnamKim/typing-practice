import {useEffect, useState} from 'react';
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

const ALL_CHARS = KEYBOARD_ROWS.flat().flatMap(k => k.variants);
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

function KeyboardHeatmap() {
    const [keyData, setKeyData] = useState({});
    const [keyCounts, setKeyCounts] = useState({});
    const [selectedKey, setSelectedKey] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setIsLoading(true);
            const data = {};
            const counts = {};
            try {
                const results = await Promise.all(
                    [...ALL_CHARS, SPACE_CHAR].map(ch =>
                        getTypoDetailStats('KOREAN', ch)
                            .then(res => ({ch, data: res.data.data.content || []}))
                            .catch(() => ({ch, data: []}))
                    )
                );
                for (const {ch, data: entries} of results) {
                    data[ch] = entries;
                    counts[ch] = entries.reduce((sum, entry) => sum + entry.typoCount, 0);
                }
            } catch (e) {
                console.error('Heatmap data load failed:', e);
            }
            setKeyData(data);
            setKeyCounts(counts);
            setIsLoading(false);
        };
        fetchAll();
    }, []);

    const getKeyCount = (key) => {
        return key.variants.reduce((sum, v) => sum + (keyCounts[v] || 0), 0);
    };

    const getKeyDetails = (key) => {
        const entries = key.variants.flatMap(v => keyData[v] || []);
        return entries.sort((a, b) => b.typoCount - a.typoCount);
    };

    const handleKeyClick = (key) => {
        const count = getKeyCount(key);
        if (count === 0) return;
        setSelectedKey(selectedKey?.label === key.label ? null : key);
    };

    const handleSpaceClick = () => {
        if (!spaceCount) return;
        const spaceKey = {label: 'Space', variants: [SPACE_CHAR]};
        setSelectedKey(selectedKey?.label === 'Space' ? null : spaceKey);
    };

    const displayChar = (ch) => {
        if (ch === '' || ch === null) return '\u2205';
        if (ch === ' ') return '\u2423';
        return ch;
    };

    const allCounts = KEYBOARD_ROWS.flat().map(getKeyCount);
    const spaceCount = keyCounts[SPACE_CHAR] || 0;
    const maxCount = Math.max(...allCounts, spaceCount, 1);

    return (
        <div className="heatmap-section">
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
            {isLoading ? (
                <div className="heatmap-loading">{t('loading')}</div>
            ) : (
                <div className="heatmap-keyboard">
                    {KEYBOARD_ROWS.map((row, ri) => (
                        <div key={ri} className={`heatmap-row${ri > 0 ? ` heatmap-row-${ri + 1}` : ''}`}>
                            {row.map((key) => {
                                const count = getKeyCount(key);
                                const color = getKeyColor(count, maxCount);
                                return (
                                    <div key={key.label}
                                         className={`heatmap-key${selectedKey?.label === key.label ? ' selected' : ''}${count > 0 ? ' clickable' : ''}`}
                                         style={{background: color.bg, color: color.text}}
                                         onClick={() => handleKeyClick(key)}>
                                        {key.label}
                                        {count > 0 && (
                                            <span className="heatmap-key-tooltip">{count}{t('errors')}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    <div className="heatmap-spacebar">
                        {(() => {
                            const color = getKeyColor(spaceCount, maxCount);
                            return (
                                <div className={`heatmap-space-key${selectedKey?.label === 'Space' ? ' selected' : ''}${spaceCount > 0 ? ' clickable' : ''}`}
                                     style={{background: color.bg, color: color.text}}
                                     onClick={handleSpaceClick}>
                                    Space
                                    {spaceCount > 0 && (
                                        <span className="heatmap-key-tooltip">{spaceCount}{t('errors')}</span>
                                    )}
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
                                {getKeyDetails(selectedKey).map((entry, i) => (
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
            )}
        </div>
    );
}

export default KeyboardHeatmap;
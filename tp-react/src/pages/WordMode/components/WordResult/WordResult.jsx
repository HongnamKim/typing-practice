import {useEffect, useRef, useCallback} from "react";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useWord} from "../../context/WordContext";
import {fetchWords} from "@/utils/wordService";
import {koreanSeparator} from "@/utils/koreanSeparator.ts";
import {t} from "@/utils/i18n.ts";
import {VscDebugRestart} from "react-icons/vsc";
import "./WordResult.css";

const difficultyLabels = {
    RANDOM: () => t('random'),
    EASY: () => t('easy'),
    NORMAL: () => t('normal'),
    HARD: () => t('hard'),
};

const WordResult = () => {
    const {isDark} = useTheme();
    const {state, dispatch, startTimeRef} = useWord();
    const {wpm, accuracy, correctWordCount, words, difficulty, wordCount, elapsedMs} = state;
    const retryBtnRef = useRef(null);

    const totalWords = words.length;
    const elapsedSec = elapsedMs / 1000;

    // CPM 계산: 자모 분리 기준 타수 + 스페이스(단어 수 - 1) / 소요 시간(분)
    const totalJamo = words.reduce((sum, word) => {
        return sum + word.split('').reduce((s, char) => s + koreanSeparator(char).length, 0);
    }, 0) + (words.length - 1); // 단어 사이 스페이스
    const cpm = elapsedSec > 0 ? Math.round(totalJamo / (elapsedSec / 60)) : 0;

    const handleRetry = useCallback(async () => {
        const newWords = await fetchWords(difficulty, wordCount);
        startTimeRef.current = null;
        dispatch({type: 'RETRY', words: newWords});
    }, [difficulty, wordCount, dispatch, startTimeRef]);

    // Tab → Enter로 retry (자동 포커스 없음)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && document.activeElement === retryBtnRef.current) {
                e.preventDefault();
                handleRetry();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleRetry]);

    return (
        <div className={`word-result ${isDark ? 'word-result-dark' : ''}`}>
            {/* 메인: WPM */}
            <div className="word-result-main">
                <span className="word-result-main-label">Session result</span>
                <div className="word-result-main-row">
                    <span className="word-result-main-value">{wpm}</span>
                    <span className="word-result-main-unit">WPM</span>
                </div>
            </div>

            {/* 상세 통계 */}
            <div className="word-result-details">
                <div className="word-result-detail-row">
                    <span className="word-result-detail-label">CPM</span>
                    <span className="word-result-detail-value">{cpm}</span>
                </div>
                <div className="word-result-detail-row">
                    <span className="word-result-detail-label">{t('wordAccuracy')}</span>
                    <span className="word-result-detail-value">{accuracy}%</span>
                </div>
                <div className="word-result-detail-row">
                    <span className="word-result-detail-label">{t('correctWords')}</span>
                    <span className="word-result-detail-value">{correctWordCount} / {totalWords}</span>
                </div>
                <div className="word-result-detail-row">
                    <span className="word-result-detail-label">{t('elapsedTimeResult')}</span>
                    <span className="word-result-detail-value">{elapsedSec.toFixed(1)}s</span>
                </div>
            </div>

            {/* 하단 */}
            <div className="word-result-bottom">
                <button
                    ref={retryBtnRef}
                    className="word-result-retry-btn"
                    onClick={handleRetry}
                    title={t('retry')}
                >
                    <VscDebugRestart/>
                </button>
                <span className="word-result-hint">{t('retryHint')}</span>
            </div>
        </div>
    );
};

export default WordResult;

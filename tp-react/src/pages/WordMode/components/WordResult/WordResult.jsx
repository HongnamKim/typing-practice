import {useEffect, useRef, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useAuth} from "@/Context/AuthContext.tsx";
import {useWord} from "../../context/WordContext";
import {koreanSeparator} from "@/utils/koreanSeparator.ts";
import {getAnonymousId} from "@/utils/tracking.ts";
import {saveWordTypingRecord} from "@/utils/wordTypingRecordApi";
import {LANGUAGE} from "@/const/config.const";
import {t} from "@/utils/i18n.ts";
import {VscDebugRestart} from "react-icons/vsc";
import SessionChart from "@/pages/Home/components/AverageScorePopUp/SessionChart";
import KeyboardHeatmap from "@/pages/Stats/components/KeyboardHeatmap";
import "./WordResult.css";

const WordResult = () => {
    const {isDark} = useTheme();
    const {user, triggerLogin} = useAuth();
    const navigate = useNavigate();
    const {state, dispatch} = useWord();
    const {wpm, accuracy, correctWordCount, words, wordIds, difficulty, wordCount, elapsedMs, wordCpms, wordAccs, typos, wordDetails} = state;
    const retryBtnRef = useRef(null);

    const totalWords = words.length;
    const elapsedSec = elapsedMs / 1000;
    const recordSentRef = useRef(false);

    // 서버에 WordTypingRecord 전송
    useEffect(() => {
        if (state.phase !== 'result') return;
        if (recordSentRef.current) return;
        recordSentRef.current = true;

        // wordId가 있는 단어들만 wordIds/wordDetails에 포함 (로컬 fallback인 경우 제외)
        const validWordIds = wordIds.filter(id => id !== null);
        const allHaveIds = validWordIds.length === wordIds.length;

        const payload = {
            language: LANGUAGE.KOREAN,
            difficulty,
            wordCount,
            anonymousId: user ? null : getAnonymousId(),
            wpm,
            accuracy: accuracy / 100,
            correctWordCount,
            incorrectWordCount: totalWords - correctWordCount,
            elapsedTimeMs: elapsedMs,
            ...(allHaveIds && {
                wordIds: validWordIds,
                wordDetails: wordDetails.map((wd, i) => ({
                    wordIndex: i,
                    wordId: wordIds[i],
                    word: wd.word,
                    typed: wd.typed,
                    correct: wd.correct,
                    timeMs: wd.timeMs,
                    typos: typos
                        .filter(t => t.wordIndex === i)
                        .map(({wordIndex, ...rest}) => rest),
                })),
            }),
        };

        saveWordTypingRecord(payload).catch((error) => {
            console.error('단어 타이핑 기록 저장 실패:', error);
        });
    }, [state.phase]); // eslint-disable-line react-hooks/exhaustive-deps

    // CPM 계산: 자모 분리 기준 타수 + 스페이스(단어 수 - 1) / 소요 시간(분)
    const totalJamo = words.reduce((sum, word) => {
        return sum + word.split('').reduce((s, char) => s + koreanSeparator(char).length, 0);
    }, 0) + (words.length - 1); // 단어 사이 스페이스
    const cpm = elapsedSec > 0 ? Math.round(totalJamo / (elapsedSec / 60)) : 0;

    const handleRetry = useCallback(() => {
        // dispatch RETRY로 phase를 'typing'으로 전환
        // → WordTyping이 마운트되며 자체적으로 fetchWords 호출
        dispatch({type: 'RETRY', words: [], wordIds: []});
        recordSentRef.current = false;
    }, [dispatch]);

    // Tab → retry 버튼으로 직접 포커스, Enter → retry 실행
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                retryBtnRef.current?.focus();
                return;
            }
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

            {/* 세션 차트 + 히트맵 */}
            {wordCpms.length > 0 && (
                <div className="word-result-session">
                    <div>
                        <div className="word-result-section-title">{t('sessionTrend')}</div>
                        <SessionChart cpmList={wordCpms} accList={wordAccs}/>
                    </div>
                    <div>
                        <div className="word-result-section-title">{t('keyboardHeatmap')}</div>
                        <KeyboardHeatmap externalTypos={typos} compact/>
                    </div>
                </div>
            )}

            {/* 하단 */}
            <div className="word-result-bottom">
                {user && (
                    <button className="word-result-stats-link" onClick={() => navigate('/stats')}>
                        {t('popupViewStats')}
                    </button>
                )}
                {!user && (
                    <button className="word-result-login-prompt" onClick={() => triggerLogin()}>
                        {t('popupLoginPrompt')}
                    </button>
                )}
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

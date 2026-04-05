import {useEffect, useCallback} from "react";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useWord} from "../../context/WordContext";
import {fetchWords} from "@/utils/wordService";
import {t} from "@/utils/i18n.ts";
import "./WordResultPopup.css";

const difficultyLabels = {
    RANDOM: () => t('random'),
    EASY: () => t('easy'),
    NORMAL: () => t('normal'),
    HARD: () => t('hard'),
};

const WordResultPopup = () => {
    const {isDark} = useTheme();
    const {state, dispatch, startTimeRef} = useWord();
    const {phase, wpm, accuracy, correctWordCount, words, difficulty, wordCount, elapsedMs} = state;

    const totalWords = words.length;
    const elapsedSec = elapsedMs / 1000;

    const handleClose = useCallback(async () => {
        const newWords = await fetchWords(difficulty, wordCount);
        startTimeRef.current = null;
        dispatch({type: 'RETRY', words: newWords});
    }, [difficulty, wordCount, dispatch, startTimeRef]);

    // ESC로 닫기 (= retry)
    useEffect(() => {
        if (phase !== 'result') return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [phase, handleClose]);

    if (phase !== 'result') return null;

    return (
        <>
            <div className="word-result-popup-bg" onClick={handleClose}/>
            <div className={`word-result-popup ${isDark ? 'word-result-popup-dark' : ''}`}>
                <div className="word-result-main">
                    <span className="word-result-main-label">Result</span>
                    <div className="word-result-main-row">
                        <span className="word-result-main-value">{wpm}</span>
                        <span className="word-result-main-unit">WPM</span>
                    </div>
                </div>

                <div className="word-result-details">
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
                        <span className="word-result-detail-value">{t('formatSeconds')(elapsedSec)}</span>
                    </div>
                    <div className="word-result-detail-row">
                        <span className="word-result-detail-label">{t('difficulty')}</span>
                        <span className="word-result-detail-value">{difficultyLabels[difficulty]()}</span>
                    </div>
                    <div className="word-result-detail-row">
                        <span className="word-result-detail-label">{t('wordCountLabel')}</span>
                        <span className="word-result-detail-value">{wordCount}</span>
                    </div>
                </div>

                <div className="word-result-bottom">
                    <span>press ESC to continue</span>
                </div>
            </div>
        </>
    );
};

export default WordResultPopup;

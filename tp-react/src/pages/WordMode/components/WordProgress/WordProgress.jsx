import {useEffect, useState, useRef} from "react";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useWord} from "../../context/WordContext";
import {t} from "@/utils/i18n.ts";
import "./WordProgress.css";

const WordProgress = () => {
    const {isDark} = useTheme();
    const {state, startTimeRef} = useWord();
    const {words, currentWordIndex, phase} = state;
    const [elapsed, setElapsed] = useState(0.0);
    const timerRef = useRef(null);

    useEffect(() => {
        if (phase !== 'typing') {
            clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            if (startTimeRef.current) {
                setElapsed((Date.now() - startTimeRef.current) / 1000);
            }
        }, 200);

        return () => clearInterval(timerRef.current);
    }, [phase, startTimeRef]);

    // phase 변경 시 타이머 리셋
    useEffect(() => {
        if (phase === 'typing') {
            setElapsed(0);
        }
    }, [phase]);

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = (sec % 60).toFixed(1);
        if (m > 0) return `${m}:${parseFloat(s) < 10 ? '0' : ''}${s}`;
        return `${s}s`;
    };

    return (
        <div className={`word-progress ${isDark ? 'word-progress-dark' : ''}`}>
            <span className="word-progress-count">
                {t('wordProgress')(currentWordIndex, words.length)}
            </span>
            <span className="word-progress-time">
                {formatTime(elapsed)}
            </span>
        </div>
    );
};

export default WordProgress;

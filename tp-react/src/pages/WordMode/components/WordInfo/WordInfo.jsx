import {useEffect, useRef, useState} from "react";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa6";
import {useWord} from "../../context/WordContext";
import {DIFFICULTIES, fetchWords, WORD_COUNTS} from "@/utils/wordService";
import {t} from "@/utils/i18n.ts";
import {Storage_Controls_Collapsed} from "@/const/config.const.ts";
import FontSizeSlider from "@/pages/Home/components/FontSizeSlider/FontSizeSlider";
import "./WordInfo.css";

const difficultyLabels = {
    RANDOM: () => t('random'),
    EASY: () => t('easy'),
    NORMAL: () => t('normal'),
    HARD: () => t('hard')
};

const WordInfo = () => {
    const {state, dispatch, startTimeRef} = useWord();
    const {difficulty, wordCount, currentWordIndex, words, phase, wordGrades} = state;
    const [elapsed, setElapsed] = useState(0);
    const timerRef = useRef(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isNarrowMode, setIsNarrowMode] = useState(false);
    const userPrefRef = useRef(localStorage.getItem(Storage_Controls_Collapsed));
    const controlsRef = useRef(null);

    useEffect(() => {
        if (phase !== 'typing') {
            clearInterval(timerRef.current);
            return;
        }
        timerRef.current = setInterval(() => {
            if (startTimeRef.current) setElapsed((Date.now() - startTimeRef.current) / 1000);
        }, 200);
        return () => clearInterval(timerRef.current);
    }, [phase]); // startTimeRef is a stable ref

    useEffect(() => {
        if (phase === 'typing') setElapsed(0);
    }, [phase]);

    const correctCount = wordGrades.filter(g => g === 'correct').length;
    const currentWpm = elapsed > 0 ? Math.round(correctCount / (elapsed / 60)) : 0;

    useEffect(() => {
        const resolveState = () => {
            const narrow = window.innerWidth <= 1080;
            if (narrow) {
                setIsCollapsed(true);
                setIsNarrowMode(true);
            } else if (userPrefRef.current !== null) {
                setIsCollapsed(userPrefRef.current === "true");
                setIsNarrowMode(false);
            } else {
                setIsCollapsed(false);
                setIsNarrowMode(false);
            }
        };
        resolveState();
        window.addEventListener("resize", resolveState);
        return () => window.removeEventListener("resize", resolveState);
    }, []);

    useEffect(() => {
        const h = (e) => {
            if (isNarrowMode && !isCollapsed && controlsRef.current && !controlsRef.current.contains(e.target)) setIsCollapsed(true);
        };
        document.addEventListener("click", h);
        return () => document.removeEventListener("click", h);
    }, [isNarrowMode, isCollapsed]);

    const handleToggle = (e) => {
        e.stopPropagation();
        const next = !isCollapsed;
        if (!isNarrowMode) {
            userPrefRef.current = String(next);
            localStorage.setItem(Storage_Controls_Collapsed, String(next));
        }
        setIsCollapsed(next);
    };

    const loadWords = async (diff, count) => {
        const w = await fetchWords(diff, count);
        startTimeRef.current = null;
        dispatch({type: 'START_TYPING', words: w});
    };
    const handleDifficultyChange = (d) => {
        dispatch({type: 'SET_DIFFICULTY', difficulty: d});
        loadWords(d, wordCount);
    };
    const handleWordCountChange = (c) => {
        dispatch({type: 'SET_WORD_COUNT', wordCount: c});
        loadWords(difficulty, c);
    };

    const controlsClass = `word-info-controls${isCollapsed ? " collapsed" : ""}${isNarrowMode ? " narrow-mode" : ""}`;

    return (
        <div className="word-info-background">
            <div className="word-info-row">
                <div className="word-info-stats">
                    <div className="word-info-stat"><span className="word-info-stat-label">WPM</span><span
                        className="word-info-stat-value highlight">{currentWpm}</span></div>
                    <div className="word-info-stat"><span className="word-info-stat-label">PROGRESS</span><span
                        className="word-info-stat-value">{currentWordIndex}/{words.length}</span></div>
                </div>
                <div className={controlsClass} ref={controlsRef}>
                    <div className="word-info-controls-inner">
                        <FontSizeSlider/>
                        <div className="word-info-control-sep"/>
                        <div className="word-info-chip-group">
                            {DIFFICULTIES.map((d) => (
                                <button key={d} className={`word-info-chip ${difficulty === d ? 'active' : ''}`}
                                        onClick={() => handleDifficultyChange(d)}
                                        tabIndex={-1}>{difficultyLabels[d]()}</button>))}
                        </div>
                        <div className="word-info-control-sep"/>
                        <div className="word-info-chip-group">
                            {WORD_COUNTS.map((c) => (
                                <button key={c} className={`word-info-chip ${wordCount === c ? 'active' : ''}`}
                                        onClick={() => handleWordCountChange(c)} tabIndex={-1}>{c}</button>))}
                        </div>
                    </div>
                    <button className="word-info-controls-toggle" onClick={handleToggle}>{isCollapsed ?
                        <FaChevronLeft/> : <FaChevronRight/>}</button>
                </div>
            </div>
        </div>
    );
};

export default WordInfo;

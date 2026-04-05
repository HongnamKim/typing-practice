import {useState, useCallback, useRef, useEffect} from "react";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useWord} from "../../context/WordContext";
import {fetchWords, DIFFICULTIES, WORD_COUNTS} from "@/utils/wordService";
import {t} from "@/utils/i18n.ts";
import {VscDebugRestart} from "react-icons/vsc";
import WordSentence from "./WordSentence";
import WordInputDisplay from "./WordInputDisplay";
import WordInput from "./WordInput";
import WordProgress from "../WordProgress/WordProgress";
import "./WordTyping.css";

const difficultyLabels = {
    RANDOM: () => t('random'),
    EASY: () => t('easy'),
    NORMAL: () => t('normal'),
    HARD: () => t('hard'),
};

const WordTyping = () => {
    const {isDark} = useTheme();
    const {state, dispatch, startTimeRef} = useWord();
    const {difficulty, wordCount, words, phase} = state;

    const [fullInput, setFullInput] = useState("");
    const [fullGrades, setFullGrades] = useState([]);
    const [isFocused, setIsFocused] = useState(true);
    const inputRef = useRef(null);

    // 최초 로드 시 단어 가져오기
    useEffect(() => {
        if (words.length === 0 && phase === 'typing') {
            loadWords(difficulty, wordCount);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadWords = async (diff, count) => {
        const newWords = await fetchWords(diff, count);
        startTimeRef.current = null;
        dispatch({type: 'START_TYPING', words: newWords});
        setFullInput("");
        setFullGrades([]);
        // 약간의 딜레이 후 포커스
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleDifficultyChange = (d) => {
        dispatch({type: 'SET_DIFFICULTY', difficulty: d});
        loadWords(d, wordCount);
    };

    const handleWordCountChange = (c) => {
        dispatch({type: 'SET_WORD_COUNT', wordCount: c});
        loadWords(difficulty, c);
    };

    const handleRetry = () => {
        loadWords(difficulty, wordCount);
    };

    const handleFullInputChange = useCallback((value) => {
        setFullInput(value);
    }, []);

    const handleCurrentGradesChange = useCallback((grades) => {
        setFullGrades(grades);
    }, []);

    const handleAreaClick = () => {
        inputRef.current?.focus();
        setIsFocused(true);
    };

    return (
        <div className={`word-typing-container ${isDark ? 'word-typing-dark' : ''}`}>
            {/* 설정: 난이도 + 단어 수 */}
            <div className="word-typing-settings">
                <div className="word-typing-setting-group">
                    {DIFFICULTIES.map((d) => (
                        <button
                            key={d}
                            className={`word-typing-chip ${difficulty === d ? 'active' : ''}`}
                            onClick={() => handleDifficultyChange(d)}
                            tabIndex={-1}
                        >
                            {difficultyLabels[d]()}
                        </button>
                    ))}
                </div>
                <div className="word-typing-setting-group">
                    {WORD_COUNTS.map((c) => (
                        <button
                            key={c}
                            className={`word-typing-chip ${wordCount === c ? 'active' : ''}`}
                            onClick={() => handleWordCountChange(c)}
                            tabIndex={-1}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* 진행 표시 */}
            <WordProgress/>

            {/* 타이핑 영역 */}
            {words.length > 0 && (
                <div className="word-typing-area" onClick={handleAreaClick}>
                    <WordSentence fullInput={fullInput} showCaret={isFocused}/>
                    <WordInputDisplay fullInput={fullInput} fullGrades={fullGrades}/>
                    <WordInput
                        ref={inputRef}
                        onFullInputChange={handleFullInputChange}
                        onCurrentGradesChange={handleCurrentGradesChange}
                        onFocusChange={setIsFocused}
                    />
                </div>
            )}

            {/* Retry 버튼 */}
            <div className="word-typing-bottom">
                <button
                    className="word-retry-btn"
                    onClick={handleRetry}
                    tabIndex={-1}
                    title={t('retry')}
                >
                    <VscDebugRestart/>
                </button>
                <span className="word-typing-bottom-hint">{t('retryHint')}</span>
            </div>
        </div>
    );
};

export default WordTyping;

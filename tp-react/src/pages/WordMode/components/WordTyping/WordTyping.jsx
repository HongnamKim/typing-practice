import {useState, useCallback, useRef, useEffect} from "react";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useWord} from "../../context/WordContext";
import {fetchWords} from "@/utils/wordService";
import {t} from "@/utils/i18n.ts";
import {VscDebugRestart} from "react-icons/vsc";
import WordSentence from "./WordSentence";
import WordInputDisplay from "./WordInputDisplay";
import WordInput from "./WordInput";
import ConsentBanner from "@/components/ConsentBanner/ConsentBanner.jsx";
import "./WordTyping.css";

const WordTyping = () => {
    const {isDark} = useTheme();
    const {state, dispatch, startTimeRef} = useWord();
    const {difficulty, wordCount, words, phase} = state;

    const [fullInput, setFullInput] = useState("");
    const [fullGrades, setFullGrades] = useState([]);
    const [isFocused, setIsFocused] = useState(true);
    const inputRef = useRef(null);
    const initialLoadRef = useRef(false);

    useEffect(() => {
        if (initialLoadRef.current) return;
        if (words.length === 0 && phase === 'typing') {
            initialLoadRef.current = true;
            loadWords(difficulty, wordCount);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadWords = async (diff, count) => {
        // fetchWords 대기 중 이전 단어가 보이지 않도록 즉시 초기화
        dispatch({type: 'START_TYPING', words: [], wordIds: []});
        const result = await fetchWords(diff, count);
        startTimeRef.current = null;
        dispatch({type: 'START_TYPING', words: result.words, wordIds: result.wordIds});
        setFullInput("");
        setFullGrades([]);
        setTimeout(() => inputRef.current?.focus(), 50);
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

            <ConsentBanner/>
        </div>
    );
};

export default WordTyping;

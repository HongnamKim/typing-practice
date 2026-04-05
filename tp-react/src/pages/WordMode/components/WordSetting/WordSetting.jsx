import {useWord} from "../../context/WordContext";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {fetchWords, DIFFICULTIES, WORD_COUNTS} from "@/utils/wordService";
import {t} from "@/utils/i18n.ts";
import "./WordSetting.css";

const difficultyLabels = {
    RANDOM: () => t('random'),
    EASY: () => t('easy'),
    NORMAL: () => t('normal'),
    HARD: () => t('hard'),
};

const WordSetting = () => {
    const {isDark} = useTheme();
    const {state, dispatch, startTimeRef} = useWord();
    const {difficulty, wordCount} = state;

    const handleStart = async () => {
        const words = await fetchWords(difficulty, wordCount);
        startTimeRef.current = null;
        dispatch({type: 'START_TYPING', words});
    };

    return (
        <div className={`word-setting ${isDark ? 'word-setting-dark' : ''}`}>
            <div className="word-setting-group">
                <span className="word-setting-label">{t('difficulty')}</span>
                <div className="word-setting-options">
                    {DIFFICULTIES.map((d) => (
                        <button
                            key={d}
                            className={`word-setting-chip ${difficulty === d ? 'active' : ''}`}
                            onClick={() => dispatch({type: 'SET_DIFFICULTY', difficulty: d})}
                        >
                            {difficultyLabels[d]()}
                        </button>
                    ))}
                </div>
            </div>
            <div className="word-setting-group">
                <span className="word-setting-label">{t('wordCountLabel')}</span>
                <div className="word-setting-options">
                    {WORD_COUNTS.map((c) => (
                        <button
                            key={c}
                            className={`word-setting-chip ${wordCount === c ? 'active' : ''}`}
                            onClick={() => dispatch({type: 'SET_WORD_COUNT', wordCount: c})}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>
            <button className="word-start-btn" onClick={handleStart}>
                {t('start')}
            </button>
        </div>
    );
};

export default WordSetting;

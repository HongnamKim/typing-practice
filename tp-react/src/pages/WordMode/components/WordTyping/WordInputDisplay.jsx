import {memo} from "react";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useSetting} from "@/Context/SettingContext.tsx";
import {useWord} from "../../context/WordContext";
import {buildDisplaySentence} from "./WordSentence";
import "./WordInputDisplay.css";

const WordInputDisplay = memo(({fullInput, fullGrades}) => {
    const {isDark} = useTheme();
    const {fontSize} = useSetting();
    const {state} = useWord();
    const {words} = state;

    const inputLength = fullInput?.length || 0;
    if (inputLength === 0) return null;

    // Sentence 레이어와 동일한 디스플레이 문자열 사용
    const displaySentence = buildDisplaySentence(words, fullInput);

    return (
        <div className="word-input-display" style={{fontSize: `${fontSize}rem`}}>
            {displaySentence.split('').map((sentenceChar, idx) => {
                // 미입력 영역 — 투명
                if (idx >= inputLength) {
                    return (
                        <span key={idx} className="word-input-char-hidden">
                            {sentenceChar}
                        </span>
                    );
                }

                const inputChar = fullInput[idx];
                const grade = fullGrades?.[idx];

                if (inputChar === ' ') {
                    return <span key={idx} className="word-input-space"> </span>;
                }

                let className = "word-input-char";
                if (grade === 'correct') {
                    className += isDark ? " word-input-char-correct dark" : " word-input-char-correct";
                } else if (grade === 'incorrect') {
                    className += " word-input-char-incorrect";
                }

                return (
                    <span key={idx} className={className}>
                        {inputChar}
                    </span>
                );
            })}
        </div>
    );
});

export default WordInputDisplay;

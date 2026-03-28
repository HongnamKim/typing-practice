import "./Sentence.css";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useQuote} from "@/Context/QuoteContext.tsx";
import {useSetting} from "@/Context/SettingContext.tsx";
import {useScore} from "@/Context/ScoreContext.tsx";

const Sentence = ({inputLength, inputValue}) => {
    const {isDark} = useTheme();
    const {sentence} = useQuote();
    const {fontSize, isCompactMode} = useSetting();
    const {inputCheck} = useScore();

    // 입력값에 맞춰 문장을 조정
    const getDisplaySentence = () => {
        if (!sentence) {
            return "";
        }

        // 일반 모드: 원본 문장 유지 (글자색만 변경)
        if (!isCompactMode) {
            return sentence;
        }

        if (!inputValue || inputValue.length === 0) {
            return sentence;
        }

        // 컴팩트 모드: 입력된 부분(inputValue) + 남은 원본 문장 부분
        const remainingSentence = sentence.slice(inputLength);
        return inputValue + remainingSentence;
    };

    const getCharacterClassName = (index) => {
        let className = "character";
        if (isDark) className += " character-dark";

        if (index < inputLength) {
            if (isCompactMode) {
                // Compact 모드: 입력된 글자는 투명 (InputDisplay가 색상 담당)
                className += " character-typed";
            } else {
                // Default 모드: 채점 완료된 글자만 색상 표시 (입력 중이면 원래 색 유지)
                if (inputCheck[index] === "correct") {
                    className += " character-correct-visible";
                } else if (inputCheck[index] === "incorrect") {
                    className += " character-incorrect-visible";
                }
            }
        }

        return className;
    };

    const displaySentence = getDisplaySentence();

    if (!displaySentence) {
        return null;
    }

    return (
        <div className={"character-container"}>
            {displaySentence.split("").map((character, index) => (
                <span
                    className={getCharacterClassName(index)}
                    key={index}
                    style={{fontSize: `${fontSize}rem`}}
                >
          {character}
        </span>
            ))}
        </div>
    );
};

export default Sentence;

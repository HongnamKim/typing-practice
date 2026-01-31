import { useContext } from "react";
import { useTheme } from "../../../Context/ThemeContext";
import { QuoteContext } from "../../../Context/QuoteContext";
import { useSetting } from "../../../Context/SettingContext";
import { ScoreContext } from "../../../Context/ScoreContext";
import "./Sentence.css";

const Sentence = ({ inputLength, inputValue }) => {
  const { isDark } = useTheme();
  const { sentence } = useContext(QuoteContext);
  const { fontSize, isCompactMode } = useSetting();
  const { inputCheck } = useContext(ScoreContext);

  // 입력값에 맞춰 문장을 조정
  const getDisplaySentence = () => {
    if (!sentence) {
      return "";
    }
    
    if (!inputValue || inputValue.length === 0) {
      return sentence;
    }

    // 입력된 부분(inputValue) + 남은 원본 문장 부분
    const remainingSentence = sentence.slice(inputLength);
    return inputValue + remainingSentence;
  };

  const getCharacterClassName = (index) => {
    let className = "character";
    if (isDark) className += " character-dark";
    
    if (index < inputLength) {
      if (isCompactMode) {
        // Compact 모드: 입력된 글자는 투명
        className += " character-typed";
      } else {
        // Default 모드: 채점 결과에 따라 색상 표시
        if (inputCheck[index] === "correct") {
          className += " character-correct-visible";
        } else if (inputCheck[index] === "incorrect") {
          className += " character-incorrect-visible";
        } else {
          className += " character-typing";
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
          style={{ fontSize: `${fontSize}rem` }}
        >
          {character}
        </span>
      ))}
    </div>
  );
};

export default Sentence;

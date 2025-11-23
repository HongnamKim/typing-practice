import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";
import { QuoteContext } from "../../../Context/QuoteContext";
import { SettingContext } from "../../../Context/SettingContext";
import "./Sentence.css";

const Sentence = ({ inputLength, inputValue }) => {
  const { isDark } = useContext(ThemeContext);
  const { sentence } = useContext(QuoteContext);
  const { fontSize } = useContext(SettingContext);

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

  const displaySentence = getDisplaySentence();

  if (!displaySentence) {
    return null;
  }

  return (
    <div className={"character-container"}>
      {displaySentence.split("").map((character, index) => (
        <span
          className={`character ${isDark ? "character-dark" : ""} ${
            index < inputLength ? "character-typed" : ""
          }`}
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

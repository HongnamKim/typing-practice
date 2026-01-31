import "./Quote.css";
import { useState, useEffect } from "react";
import Sentence from "./Sentence/Sentence";
import Author from "./Author/Author";
import { useTheme } from "../../Context/ThemeContext";
import Input from "./Input/Input";
import InputDisplay from "./InputDisplay/InputDisplay";
import { useQuote } from "../../Context/QuoteContext";
import { useSetting } from "../../Context/SettingContext";

const Quote = () => {
  const { isDark } = useTheme();
  const { author, sentence } = useQuote();
  const { isCompactMode } = useSetting();
  const [inputValue, setInputValue] = useState("");

  // 문장이 변경되면 inputValue 초기화
  useEffect(() => {
    setInputValue("");
  }, [sentence]);

  const getQuoteContainerClassName = () => {
    let className = "quote-container";
    if (isDark) className += " quote-dark";
    if (!isCompactMode) className += " default-mode";
    return className;
  };

  /**
   * Quote : 인용문 = 문장 (sentence) + 저자 (author)
   * Sentence : 문장
   * Author : 저자
   */

  return (
    <div className={getQuoteContainerClassName()}>
      <div className={"quote-container-upper"}>
        {/* QuoteDisplay*/}
        <div className={`author-container ${isDark ? "author-dark" : ""}`}>
          <Author author={author} />
        </div>
        <div className="sentence-input-wrapper">
          <Sentence inputLength={inputValue.length} inputValue={inputValue} />
          <InputDisplay input={inputValue} />
          {/* QuoteInput */}
          <Input onInputChange={setInputValue} />
        </div>
      </div>
    </div>
  );
};

export default Quote;

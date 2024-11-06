import "./Input.css";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";
import { QuoteContext } from "../../../Context/QuoteContext";

const Input = () => {
  const { isDark } = useContext(ThemeContext);
  const { sentence, setQuotesIndex } = useContext(QuoteContext);
  const [input, setInput] = useState("");

  const textareaRef = useRef(null);

  const adjustInputRows = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    // 초기 높이 설정
    textarea.rows = 1;

    // 브라우저 체크
    const userAgent = navigator.userAgent.toLowerCase();

    const isFirefox = userAgent.indexOf("firefox") > -1;

    const baseScrollHeight = textarea.clientHeight;
    //console.log(`scrollHeight: ${textarea.scrollHeight}`);
    //console.log(`clientScrollHeight: ${textarea.clientHeight}`);

    const rows = textarea.scrollHeight / baseScrollHeight;

    //console.log(rows);

    textarea.rows = isFirefox ? Math.floor(rows) : Math.floor(rows);
  };

  const onInputChange = (e) => {
    const newInputValue = e.target.value;

    // 입력값 길이가 문장보다 짧을 경우
    if (newInputValue.length <= sentence.length) {
      setInput((prev) => {
        // 엔터키 입력 무시
        if (newInputValue[newInputValue.length - 1] === "\n") {
          return prev;
        }
        // state 업데이트
        return e.target.value;
      });
    } else {
      // 입력값 길이가 문장보다 길 경우
      console.log("제출");
      setQuotesIndex((prev) => prev + 1);
      setInput("");
    }
  };

  const preventPaste = (e) => {
    e.preventDefault();
    alert("붙여넣기가 금지되어 있습니다!");
  };

  useEffect(() => {
    adjustInputRows();
  }, [input]);

  return (
    <textarea
      ref={textareaRef}
      className={`input ${isDark ? "input-dark" : ""}`}
      placeholder={"위 문장을 입력하세요."}
      autoFocus={true}
      autoComplete={"off"}
      spellCheck={false}
      rows={1}
      cols={30}
      value={input}
      onInput={onInputChange}
      onPaste={preventPaste}
      onDrop={preventPaste}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default Input;

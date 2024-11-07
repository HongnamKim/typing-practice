import "./Input.css";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";
import { QuoteContext } from "../../../Context/QuoteContext";
import { ScoreContext } from "../../../Context/ScoreContext";
import {
  KEY_ARROW_DOWN,
  KEY_ARROW_LEFT,
  KEY_ARROW_RIGHT,
  KEY_ARROW_UP,
  KEY_COMMANDS,
  KEY_ESC,
} from "../../../const/key.const";

const Input = () => {
  const { isDark } = useContext(ThemeContext);
  const {
    inputCheck,
    setInputCheck,
    setTotalScore,
    correctCount,
    setCorrectCount,
    incorrectCount,
    setIncorrectCount,
  } = useContext(ScoreContext);
  const { sentence, setQuotesIndex } = useContext(QuoteContext);
  const [input, setInput] = useState("");

  const textareaRef = useRef(null);

  // textarea rows 조절
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 초기 높이 설정
    textarea.rows = 1;
    textarea.rows = Math.floor(textarea.scrollHeight / textarea.clientHeight);
  }, [input]);

  // 입력 초기화
  const clearInput = () => {
    // TODO 타자 속도 계산 초기화 로직

    // 입력 초기화
    setInput("");
    // 정확도 초기화
    setCorrectCount(0);
    setIncorrectCount(0);
    // 글자별 정답 체크 초기화
    setInputCheck((prev) => prev.map(() => "none"));
  };

  const handleKeyDown = (e) => {
    if (!KEY_COMMANDS.includes(e.key)) {
      return;
    }

    if (e.key === KEY_ESC) {
      // TODO 타자 속도 계산 초기화 로직

      clearInput();
      return;
    }

    if (e.key === KEY_ARROW_UP || e.key === KEY_ARROW_RIGHT) {
      setQuotesIndex((prev) => prev + 1);
      // TODO 타자 속도 계산 초기화 로직

      clearInput();
      return;
    }

    if (e.key === KEY_ARROW_DOWN || e.key === KEY_ARROW_LEFT) {
      setQuotesIndex((prev) => prev - 1);
      // TODO 타자 속도 계산 초기화 로직
      clearInput();
    }
  };

  const submitInput = (newValue) => {
    // 마지막 문자 검증
    const lastCharIndex = newValue.length - 2; // 실제 들어오는 값은 마지막에 스페이스 혹은 \n 이 포함됨
    const isLastCharCorrect =
      newValue[lastCharIndex] === sentence[lastCharIndex];

    // 정확도 계산
    const calculateAccuracy = (isCorrect) => {
      const totalChecked = correctCount + incorrectCount + 1;
      const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
      return (newCorrectCount / totalChecked) * 100;
    };

    const newAcc = calculateAccuracy(isLastCharCorrect);

    setTotalScore((prev) => ({
      ...prev,
      accs: [...prev.accs, newAcc],
      cnt: prev.cnt + 1,
    }));

    console.log(`[Input.jsx] 제출 : ${newValue} [ACC: ${newAcc}]`);
  };

  const onInputChange = (e) => {
    const newValue = e.target.value;

    if (newValue.length === 0) {
      clearInput();
    }

    // 입력값 길이가 문장보다 짧을 경우
    if (newValue.length <= sentence.length) {
      // 엔터키 입력이 아닌 경우만 업데이트
      if (newValue[newValue.length - 1] === "\n") {
        return;
      }
      setInput(newValue);

      const checkLength = newValue.length - 1;

      setInputCheck((prevCheck) => {
        const newCheck = [...prevCheck];

        if (newValue.length === 0) {
          return newCheck.map(() => "none");
        }

        if (checkLength > 0) {
          const lastCharIndex = checkLength - 1;

          const isChecked =
            newCheck[lastCharIndex] === "correct" ||
            newCheck[lastCharIndex] === "incorrect";

          if (!isChecked) {
            if (newValue[lastCharIndex] === sentence[lastCharIndex]) {
              newCheck[lastCharIndex] = "correct";

              setCorrectCount((prev) => prev + 1);
            } else {
              newCheck[lastCharIndex] = "incorrect";
              setIncorrectCount((prev) => prev + 1);
            }
          }
        }

        // 현재 입력 위치부터 끝까지 'none' 으로 설정
        for (let i = checkLength + 1; i < newCheck.length; i++) {
          newCheck[i] = "none";
        }

        return newCheck;
      });

      return;
    }

    // 입력값 길이가 문장보다 길 경우 (입력 완료)
    submitInput(newValue);

    setQuotesIndex((prev) => prev + 1);
    clearInput();
  };

  const preventPaste = (e) => {
    e.preventDefault();
    alert("붙여넣기가 금지되어 있습니다!");
  };

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
      onKeyDown={handleKeyDown}
      onPaste={preventPaste}
      onDrop={preventPaste}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default Input;

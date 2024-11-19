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
import { koreanSeparator } from "../../../utils/koreanSeparator";

const Input = () => {
  const { isDark } = useContext(ThemeContext);
  const {
    speedCheck, // 타이핑 지속 시간 측정 트리거
    setSpeedCheck,
    currentCpm,
    setCurrentCpm, // 현재 타자 속도 state 값의 set 함수
    setLastCpm,
    setInputCheck, // 각 글자 별 정답 체크
    //totalScore, // 모든 점수들
    setTotalScore, // 접속 후 모든 점수들 set 함수
    correctCount, // 타이핑 중 정확히 입력한 횟수
    setCorrectCount, //
    incorrectCount, // 타이핑 중 틀린 횟수
    setIncorrectCount,
  } = useContext(ScoreContext);
  const { sentence, setQuotesIndex } = useContext(QuoteContext); // 예문, 예문의 인덱스
  const [input, setInput] = useState(""); // 사용자 입력값
  const speedInterval = useRef(null); // setInterval 을 참조하기 위함
  const startTime = useRef(null); // 타이핑 시작 시간
  const currentTime = useRef(null); // 타이핑 지속 시간
  const separatedSentence = useRef(null); // 예문 자모 분리값
  const separatedInput = useRef([]); // 입력값 자모 분리값
  const typedCharCount = useRef([]); // 타이핑한 character 수

  const textareaRef = useRef(null); // DOM 요소 접근용

  // textarea rows 조절
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // 초기 높이 설정
    textarea.rows = 1;
    textarea.rows = Math.floor(textarea.scrollHeight / textarea.clientHeight);
  }, [input]);

  useEffect(() => {
    separatedSentence.current = sentence.split("").map((character) => {
      return koreanSeparator(character);
    });
  }, [sentence]);

  // 타자 속도 계산
  const getSpeed = () => {
    // 입력 지속 시간 (초)
    currentTime.current = (new Date() - startTime.current) / 1000;

    const currentCpm = Math.round(
      (sum(typedCharCount.current) / currentTime.current) * 60,
    );

    setCurrentCpm(currentCpm);
  };
  const speedCheckStart = () => {
    startTime.current = new Date();
    speedInterval.current = setInterval(getSpeed, 100);
  };

  // 입력 초기화
  const clearInput = (isSubmit) => {
    // 입력 초기화
    setInput("");
    separatedInput.current = [];

    // 정확도 초기화
    setCorrectCount(0);
    setIncorrectCount(0);

    // 글자별 정답 체크 초기화
    setInputCheck((prev) => prev.map(() => "none"));

    // 타자 속도 초기화
    typedCharCount.current = [];
    clearInterval(speedInterval.current);
    setSpeedCheck(true);

    //console.log(typedCharCount.current);

    if (isSubmit) {
      return;
    }
    setCurrentCpm(0);
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
    const newAcc = calculateAccuracy(
      isLastCharCorrect,
      correctCount,
      incorrectCount,
    );

    setLastCpm(currentCpm);

    setTotalScore((prev) => ({
      highestCpm: prev.highestCpm < currentCpm ? currentCpm : prev.highestCpm,
      cpms: prev.cpms + currentCpm,
      accs: prev.accs + newAcc,
      cnt: prev.cnt + 1,
    }));

    clearInterval(speedInterval.current);
    setSpeedCheck(true);

    console.log(`[Input.jsx] 제출 : ${newValue} [ACC: ${newAcc}]`);
  };

  const onInputChange = (e) => {
    if (speedCheck) {
      speedCheckStart();
      setSpeedCheck(false);
    }

    const newValue = e.target.value;

    if (newValue.length === 0) {
      clearInput();
      return;
    }

    // 입력값 길이가 문장보다 길 경우 (입력 완료)
    if (newValue.length > sentence.length) {
      submitInput(newValue);

      // 다음 문장
      setQuotesIndex((prev) => prev + 1);
      // 입력 초기화
      clearInput(true);

      return;
    }

    // 입력값 길이가 문장보다 짧을 경우
    // 엔터키 입력 무시
    if (newValue[newValue.length - 1] === "\n") {
      return;
    }

    setInput(newValue);

    // 입력값 자모 분리
    for (let i = 0; i < newValue.length; i++) {
      separatedInput.current[i] = koreanSeparator(newValue[i]);
    }

    typedCharCount.current = separatedInput.current.map((char) => {
      return char.length;
    });

    // 채점 로직
    setInputCheck((prevCheck) => {
      const lastCharIndex = newValue.length - 1;

      // 채점되지 않고 다음 글자로 넘어간 경우 "틀림" 처리
      if (lastCharIndex > 0) {
        const isChecked = prevCheck[lastCharIndex - 1] !== "none";

        if (!isChecked) {
          prevCheck[lastCharIndex - 1] = "incorrect";
        }
      }

      // 현재 입력 글자 채점
      // 입력한 값이 예문보다 길 경우
      if (
        separatedInput.current[lastCharIndex].length >=
        separatedSentence.current[lastCharIndex].length
      ) {
        for (
          let i = 0;
          i < separatedSentence.current[lastCharIndex].length;
          i++
        ) {
          if (
            separatedInput.current[lastCharIndex][i] !==
            separatedSentence.current[lastCharIndex][i]
          ) {
            prevCheck[lastCharIndex] = "incorrect";
            setIncorrectCount((prev) => prev + 1);
            break;
          }
          if (i === separatedSentence.current[lastCharIndex].length - 1) {
            prevCheck[lastCharIndex] = "correct";

            setCorrectCount((prev) => prev + 1);
          }
        }
      } else {
        // 입력한 값이 예문보다 짧을 경우
        for (let i = 0; i < separatedInput.current[lastCharIndex].length; i++) {
          if (
            separatedInput.current[lastCharIndex][i] !==
            separatedSentence.current[lastCharIndex][i]
          ) {
            prevCheck[lastCharIndex] = "incorrect";
            setIncorrectCount((prev) => prev + 1);
            break;
          } else {
            prevCheck[lastCharIndex] = "none";
          }
        }
      }

      // 현재 입력 위치부터 끝까지 'none' 으로 설정
      for (let i = lastCharIndex + 1; i < prevCheck.length; i++) {
        prevCheck[i] = "none";
      }

      return prevCheck;
    });
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

const calculateAccuracy = (isCorrect, correctCount, incorrectCount) => {
  const totalChecked = correctCount + incorrectCount + 1;
  const newCorrectCount = correctCount + (isCorrect ? 1 : 0);
  return (newCorrectCount / totalChecked) * 100;
};

const sum = (array) => {
  return array.reduce((prev, curr) => prev + curr, 0);
};

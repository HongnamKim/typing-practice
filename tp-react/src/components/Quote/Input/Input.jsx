import "./Input.css";
import {useContext, useEffect, useRef, useState} from "react";
import {useTheme} from "../../../Context/ThemeContext";
import {QuoteContext} from "../../../Context/QuoteContext";
import {ScoreContext} from "../../../Context/ScoreContext";
import {resultPeriodSet, useSetting} from "../../../Context/SettingContext";
import {
    KEY_ARROW_DOWN,
    KEY_ARROW_LEFT,
    KEY_ARROW_RIGHT,
    KEY_ARROW_UP,
    KEY_COMMANDS,
    KEY_ESC,
} from "../../../const/key.const";
import {koreanSeparator} from "../../../utils/koreanSeparator";

const Input = ({onInputChange: onInputChangeCallback}) => {
    const {isDark} = useTheme();
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
        cpmList,
        setCpmList,
        accList,
        setAccList,
        showPopup,
        setShowPopup,
        setPopupData,
    } = useContext(ScoreContext);
    const {sentence, setQuotesIndex} = useContext(QuoteContext); // 예문, 예문의 인덱스
    const {resultPeriod, fontSize, isCompactMode} = useSetting();
    const [input, setInput] = useState(""); // 사용자 입력값
    const speedInterval = useRef(null); // setInterval 을 참조하기 위함
    const startTime = useRef(null); // 타이핑 시작 시간
    const currentTime = useRef(null); // 타이핑 지속 시간
    const separatedSentence = useRef(null); // 예문 자모 분리값
    const separatedInput = useRef([]); // 입력값 자모 분리값
    const typedCharCount = useRef([]); // 타이핑한 character 수

    const textareaRef = useRef(null); // DOM 요소 접근용

    // textarea 높이 자동 조절
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // 높이 리셋 후 scrollHeight로 설정
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }, [input, fontSize, isCompactMode]);

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

        // 상위 컴포넌트의 inputValue도 초기화
        if (onInputChangeCallback) {
            onInputChangeCallback("");
        }

        // 정확도 초기화
        setCorrectCount(0);
        setIncorrectCount(0);

        // 글자별 정답 체크 초기화
        setInputCheck((prev) => prev.map(() => "none"));

        // 타자 속도 초기화
        typedCharCount.current = [];
        clearInterval(speedInterval.current);
        setSpeedCheck(true);


        if (isSubmit) {
            return;
        }
        setCurrentCpm(0);
    };

    const handleKeyDown = (e) => {
        // 엔터키 처리
        if (e.key === "Enter") {
            e.preventDefault();

            // 문장 입력이 완료된 경우 제출
            if (input.length === sentence.length) {
                const submitValue = input + " "; // 스페이스 추가하여 제출 형식 맞춤
                submitInput(submitValue);
                setQuotesIndex((prev) => prev + 1);
                clearInput(true);
            }
            // 문장 입력 중에는 엔터키 무시
            return;
        }

        if (!KEY_COMMANDS.includes(e.key)) {
            return;
        }

        if (e.key === KEY_ESC) {
            // 팝업이 열려있으면 팝업 닫기
            if (showPopup) {
                setShowPopup(false);
                return;
            }

            clearInput();
            return;
        }

        if (e.key === KEY_ARROW_UP || e.key === KEY_ARROW_RIGHT) {
            // 먼저 입력 초기화
            clearInput();
            // 상태 업데이트 후 문장 변경
            setTimeout(() => {
                setQuotesIndex((prev) => prev + 1);
            }, 0);
            return;
        }

        if (e.key === KEY_ARROW_DOWN || e.key === KEY_ARROW_LEFT) {
            // 먼저 입력 초기화
            clearInput();
            // 상태 업데이트 후 문장 변경
            setTimeout(() => {
                setQuotesIndex((prev) => prev - 1);
            }, 0);
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

        // CPM, ACC 리스트에 추가
        const newCpmList = [...cpmList, currentCpm];
        const newAccList = [...accList, newAcc];
        setCpmList(newCpmList);
        setAccList(newAccList);

        setTotalScore((prev) => {
            const newCnt = prev.cnt + 1;

            // 결과 주기 확인 및 팝업 표시
            if (
                resultPeriod !== null &&
                resultPeriod < resultPeriodSet.length - 1 &&
                newCnt % resultPeriodSet[resultPeriod] === 0
            ) {
                const period = resultPeriodSet[resultPeriod];
                const recentCpmList = newCpmList.slice(-period);
                const recentAccList = newAccList.slice(-period);

                setPopupData({
                    avgCpm: Math.round(average(recentCpmList)),
                    maxCpm: Math.round(max(recentCpmList)),
                    acc: Math.round(average(recentAccList)),
                });
                setShowPopup(true);
            }

            return {
                highestCpm: prev.highestCpm < currentCpm ? currentCpm : prev.highestCpm,
                cpms: prev.cpms + currentCpm,
                accs: prev.accs + newAcc,
                cnt: newCnt,
            };
        });

        clearInterval(speedInterval.current);
        setSpeedCheck(true);

        
    };

    const onInputChange = (e) => {
        // 팝업이 열려있으면 입력 무시
        if (showPopup) {
            return;
        }

        if (speedCheck) {
            speedCheckStart();
            setSpeedCheck(false);
        }

        const newValue = e.target.value;

        // 상위 컴포넌트로 값 전달
        if (onInputChangeCallback) {
            onInputChangeCallback(newValue);
        }

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

        // 입력 길이가 문장 길이와 같아지면 더 이상 입력 불가
        if (newValue.length === sentence.length) {
            // 마지막 글자까지 입력했으므로 입력값 설정은 하되
            // 추가 입력은 막음
            setInput(newValue);
            processInput(newValue);
            return;
        }

        setInput(newValue);
        processInput(newValue);
    };

    // 입력값 처리 (자모 분리 및 채점)
    const processInput = (newValue) => {
        // 입력값 자모 분리
        for (let i = 0; i < newValue.length; i++) {
            separatedInput.current[i] = koreanSeparator(newValue[i]);
        }

        typedCharCount.current = separatedInput.current.map((char) => {
            return char.length;
        });

        // 채점 로직 실행
        performGrading(newValue);
    };

    // 채점 로직을 별도 함수로 분리
    const performGrading = (newValue) => {
        setInputCheck((prevCheck) => {
            const lastCharIndex = newValue.length - 1;

            // 이전 글자 재채점 (다음 글자로 넘어갔을 때 최종 확정)
            if (lastCharIndex > 0) {
                const prevCharIndex = lastCharIndex - 1;
                const prevInputSeparated = separatedInput.current[prevCharIndex];
                const prevSentenceSeparated = separatedSentence.current[prevCharIndex];
                const isChecked = prevCheck[prevCharIndex] !== "none";

                if (!isChecked) {
                    // 채점되지 않은 경우 오답 처리
                    prevCheck[prevCharIndex] = "incorrect";
                    setIncorrectCount((prev) => prev + 1);
                } else {
                    // 이미 채점된 경우 재채점 (받침 변화 등으로 인한 최종 확정)
                    let isFinalCorrect = false;

                    // 길이가 같고 모든 자모가 일치하는지 확인
                    if (prevInputSeparated.length === prevSentenceSeparated.length) {
                        isFinalCorrect = true;
                        for (let i = 0; i < prevSentenceSeparated.length; i++) {
                            if (prevInputSeparated[i] !== prevSentenceSeparated[i]) {
                                isFinalCorrect = false;
                                break;
                            }
                        }
                    }

                    // 이전에 정답이었는데 최종적으로 오답인 경우
                    if (prevCheck[prevCharIndex] === "correct" && !isFinalCorrect) {
                        prevCheck[prevCharIndex] = "incorrect";
                        setCorrectCount((prev) => prev - 1);
                        setIncorrectCount((prev) => prev + 1);
                    }
                    // 이전에 오답이었는데 최종적으로 정답인 경우 (거의 없지만 안전장치)
                    else if (prevCheck[prevCharIndex] === "incorrect" && isFinalCorrect) {
                        prevCheck[prevCharIndex] = "correct";
                        setCorrectCount((prev) => prev + 1);
                        setIncorrectCount((prev) => prev - 1);
                    }
                }
            }

            // 현재 입력 글자 채점
            const currentInputSeparated = separatedInput.current[lastCharIndex];
            const currentSentenceSeparated = separatedSentence.current[lastCharIndex];

            // 입력한 자모 수가 예문의 자모 수와 같거나 많을 경우 (글자 완성)
            if (currentInputSeparated.length >= currentSentenceSeparated.length) {
                let isCorrect = true;

                // 모든 자모가 일치하는지 확인
                for (let i = 0; i < currentSentenceSeparated.length; i++) {
                    if (currentInputSeparated[i] !== currentSentenceSeparated[i]) {
                        isCorrect = false;
                        break;
                    }
                }

                if (isCorrect) {
                    // 정답으로 채점 (단, 다음 글자로 넘어갈 때 재확인됨)
                    if (prevCheck[lastCharIndex] !== "correct") {
                        prevCheck[lastCharIndex] = "correct";
                        setCorrectCount((prev) => prev + 1);
                    }
                } else {
                    // 오답으로 채점
                    if (prevCheck[lastCharIndex] !== "incorrect") {
                        prevCheck[lastCharIndex] = "incorrect";
                        setIncorrectCount((prev) => prev + 1);
                    }
                }
            } else {
                // 입력한 자모 수가 예문보다 적을 경우 (글자 입력 중)
                let isPartialCorrect = true;

                // 지금까지 입력한 자모가 모두 맞는지 확인
                for (let i = 0; i < currentInputSeparated.length; i++) {
                    if (currentInputSeparated[i] !== currentSentenceSeparated[i]) {
                        isPartialCorrect = false;
                        break;
                    }
                }

                if (!isPartialCorrect) {
                    // 중간 과정이지만 이미 틀렸으면 오답 처리
                    if (prevCheck[lastCharIndex] !== "incorrect") {
                        prevCheck[lastCharIndex] = "incorrect";
                        setIncorrectCount((prev) => prev + 1);
                    }
                } else {
                    // 중간 과정이고 지금까지는 맞음 -> "none" 유지 (아직 채점 안 함)
                    prevCheck[lastCharIndex] = "none";
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
            autoFocus={true}
            autoComplete={"off"}
            spellCheck={false}
            value={input}
            rows={1}
            placeholder={isCompactMode ? "" : "위 문장을 입력하세요."}
            onInput={onInputChange}
            onKeyDown={handleKeyDown}
            onPaste={preventPaste}
            onDrop={preventPaste}
            onContextMenu={(e) => e.preventDefault()}
            style={{
                fontSize: `${fontSize}rem`,
                lineHeight: 1.8
            }}
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

const average = (array) => {
    if (array.length === 0) return 0;
    return sum(array) / array.length;
};

const max = (array) => {
    if (array.length === 0) return 0;
    return Math.max(...array);
};

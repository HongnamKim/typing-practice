import "./Input.css";
import {useEffect, useRef, useState} from "react";
import {useTheme} from "@/Context/ThemeContext.jsx";
import {useQuote} from "@/Context/QuoteContext.jsx";
import {useScore} from "@/Context/ScoreContext.jsx";
import {useError} from "@/Context/ErrorContext.jsx";
import {resultPeriodSet, useSetting} from "@/Context/SettingContext.jsx";
import {
    KEY_ARROW_DOWN,
    KEY_ARROW_LEFT,
    KEY_ARROW_RIGHT,
    KEY_ARROW_UP,
    KEY_COMMANDS,
    KEY_ESC,
} from "@/const/key.const.js";
import {RESET_COUNT_THRESHOLD_RATIO} from "@/const/config.const.ts";
import {koreanSeparator} from "@/utils/koreanSeparator.ts";
import {createFlatTypoEntry, isLanguageSwitchMistake} from "@/utils/typoUtils.ts";
import {saveTypingRecord} from "@/utils/typingRecordApi.ts";
import {areJamoEqual, calculateAccuracy, sum, average, max} from "./InputUtils";

const Input = ({onInputChange: onInputChangeCallback}) => {
    const {isDark} = useTheme();
    const {showError} = useError();
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
        resetCount,
        setResetCount,
    } = useScore();
    const {sentence, currentQuote, setQuotesIndex} = useQuote(); // 예문, 예문의 인덱스
    const {resultPeriod, fontSize, isCompactMode} = useSetting();
    const [input, setInput] = useState(""); // 사용자 입력값
    const speedInterval = useRef(null); // setInterval 을 참조하기 위함
    const startTime = useRef(null); // 타이핑 시작 시간
    const currentTime = useRef(null); // 타이핑 지속 시간
    const separatedSentence = useRef(null); // 예문 자모 분리값
    const separatedInput = useRef([]); // 입력값 자모 분리값
    const typedCharCount = useRef([]); // 타이핑한 character 수
    const maxInputLengthRef = useRef(0); // 현재 시도에서 도달한 최대 입력 길이
    const typosRef = useRef([]); // 오타 누적 배열
    const flatSentenceRef = useRef([]); // 예문 flat 자모 배열
    const flatInputRef = useRef([]); // 입력 flat 자모 배열
    const maxCheckedFlatIndexRef = useRef(0); // 체크 완료한 최대 flat 인덱스
    const lastResetTimeRef = useRef(0); // resetCount 중복 증가 방지용 타임스탬프

    // resetCount를 안전하게 증가시키는 함수 (50ms 이내 중복 호출 무시)
    const incrementResetCount = () => {
        const now = Date.now();
        if (now - lastResetTimeRef.current < 50) return;
        lastResetTimeRef.current = now;
        setResetCount((prev) => prev + 1);
    };

    // 오답 처리
    const markIncorrect = (prevCheck, charIndex) => {
        prevCheck[charIndex] = "incorrect";
        setIncorrectCount((prev) => prev + 1);
    };

    // 문장 이동 (화살표 키)
    const navigateQuote = (direction) => {
        clearInput();
        setResetCount(0);
        typosRef.current = [];
        setTimeout(() => {
            setQuotesIndex((prev) => prev + direction);
        }, 0);
    };

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
        flatSentenceRef.current = separatedSentence.current.flat();
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

        // 최대 입력 길이 리셋
        maxInputLengthRef.current = 0;
        flatInputRef.current = [];
        maxCheckedFlatIndexRef.current = 0;

        if (isSubmit) {
            return;
        }
        setCurrentCpm(0);
    };

    const handleKeyDown = (e) => {
        // 엔터키 처리
        if (e.key === "Enter") {
            // IME 조합 중이면 무시 (조합 완료 후 처리)
            if (e.nativeEvent.isComposing) {
                return;
            }

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

            if (input.length > 0) {
                incrementResetCount();
            }
            clearInput();
            return;
        }

        if (e.key === KEY_ARROW_UP || e.key === KEY_ARROW_RIGHT) {
            navigateQuote(1);
            return;
        }

        if (e.key === KEY_ARROW_DOWN || e.key === KEY_ARROW_LEFT) {
            navigateQuote(-1);
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

        // 타이핑 기록 저장 API 호출 (fire-and-forget)
        const quoteId = currentQuote?.quoteId;
        if (quoteId) {
            const accuracy = (correctCount + (isLastCharCorrect ? 1 : 0))
                / (correctCount + incorrectCount + 1);

            saveTypingRecord({
                quoteId,
                cpm: currentCpm,
                accuracy: Math.round(accuracy * 1000) / 1000,
                charLength: sentence.length,
                resetCount,
                typos: typosRef.current,
            }).catch((error) => console.error('타이핑 기록 저장 실패:', error));
        }

        // typos, resetCount 초기화
        typosRef.current = [];
        setResetCount(0);
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
            // 30% 이상 입력했었으면 resetCount 증가 (ESC와의 중복은 incrementResetCount에서 방지)
            const threshold = Math.round(sentence.length * RESET_COUNT_THRESHOLD_RATIO);
            if (maxInputLengthRef.current >= threshold) {
                incrementResetCount();
            }
            clearInput();
            return;
        }

        // 최대 입력 길이 추적
        maxInputLengthRef.current = Math.max(maxInputLengthRef.current, newValue.length);

        // 입력값 길이가 문장보다 길 경우 (입력 완료)
        if (newValue.length > sentence.length) {
            submitInput(newValue);

            // 다음 문장
            setQuotesIndex((prev) => prev + 1);
            // 입력 초기화
            clearInput(true);

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
        separatedInput.current.length = newValue.length;

        typedCharCount.current = separatedInput.current.map((char) => {
            return char.length;
        });

        // flat 기반 typo 수집
        const newFlatInput = separatedInput.current.flat();
        const newLen = newFlatInput.length;

        if (newLen > maxCheckedFlatIndexRef.current) {
            // 이전에 체크하지 않은 인덱스만 비교
            for (let i = maxCheckedFlatIndexRef.current; i < newLen; i++) {
                const exp = flatSentenceRef.current[i];
                const act = newFlatInput[i];
                if (exp !== undefined && act !== undefined && exp !== act && !isLanguageSwitchMistake(act)) {
                    typosRef.current.push(createFlatTypoEntry(
                        i, exp, act, separatedSentence.current, sentence,
                    ));
                }
            }
            maxCheckedFlatIndexRef.current = newLen;
        }
        flatInputRef.current = newFlatInput;

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
                    markIncorrect(prevCheck, prevCharIndex);
                } else {
                    // 이미 채점된 경우 재채점 (받침 변화 등으로 인한 최종 확정)
                    const isFinalCorrect = areJamoEqual(prevInputSeparated, prevSentenceSeparated);

                    // 이전에 정답이었는데 최종적으로 오답인 경우
                    if (prevCheck[prevCharIndex] === "correct" && !isFinalCorrect) {
                        setCorrectCount((prev) => prev - 1);
                        markIncorrect(prevCheck, prevCharIndex);
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
                // 예문 자모 길이만큼 비교
                let isCorrect = areJamoEqual(
                    currentInputSeparated.slice(0, currentSentenceSeparated.length),
                    currentSentenceSeparated,
                );

                // 입력 자모가 예문보다 많을 경우, 추가 자모가 다음 글자의 시작과 일치하는지 확인
                if (isCorrect && currentInputSeparated.length > currentSentenceSeparated.length) {
                    const extraJamo = currentInputSeparated.slice(currentSentenceSeparated.length);
                    const nextCharIndex = lastCharIndex + 1;

                    if (nextCharIndex < sentence.length) {
                        const nextSentenceSeparated = separatedSentence.current[nextCharIndex];
                        isCorrect = areJamoEqual(
                            extraJamo,
                            nextSentenceSeparated.slice(0, extraJamo.length),
                        );
                    } else {
                        // 마지막 글자인데 추가 자모가 있으면 오답
                        isCorrect = false;
                    }
                }

                if (isCorrect) {
                    if (prevCheck[lastCharIndex] !== "correct") {
                        prevCheck[lastCharIndex] = "correct";
                        setCorrectCount((prev) => prev + 1);
                    }
                } else {
                    if (prevCheck[lastCharIndex] !== "incorrect") {
                        prevCheck[lastCharIndex] = "incorrect";
                        setIncorrectCount((prev) => prev + 1);
                    }
                }
            } else {
                // 입력한 자모 수가 예문보다 적을 경우 (글자 입력 중)
                const isPartialCorrect = areJamoEqual(
                    currentInputSeparated,
                    currentSentenceSeparated.slice(0, currentInputSeparated.length),
                );

                if (!isPartialCorrect) {
                    if (prevCheck[lastCharIndex] !== "incorrect") {
                        markIncorrect(prevCheck, lastCharIndex);
                    }
                } else {
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
        showError("붙여넣기가 금지되어 있습니다!");
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

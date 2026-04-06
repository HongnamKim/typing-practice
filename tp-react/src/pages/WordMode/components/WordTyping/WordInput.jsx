import {useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle} from "react";
import {useWord} from "../../context/WordContext";
import {koreanSeparator} from "@/utils/koreanSeparator.ts";
import {areJamoEqual} from "@/pages/Home/components/Quote/Input/InputUtils";
import {incrementSessionTypingCount} from "@/utils/sessionUtils.ts";
import "./WordInput.css";

const WordInput = forwardRef(({onFullInputChange, onCurrentGradesChange, onFocusChange}, ref) => {
    const {state, dispatch, startTimeRef} = useWord();
    const {words, phase} = state;

    const [fullInput, setFullInput] = useState("");
    const textareaRef = useRef(null);
    const goBackBlockedRef = useRef(false); // 현재 단어에 2글자 이상 입력 시 이전 단어 복귀 차단

    // 부모에서 focus() 호출 가능하도록 ref 노출
    useImperativeHandle(ref, () => ({
        focus: () => textareaRef.current?.focus(),
    }));
    const confirmedCountRef = useRef(0);

    // phase 또는 words 변경 시 초기화
    useEffect(() => {
        if (phase === 'typing') {
            setFullInput("");
            confirmedCountRef.current = 0;
            goBackBlockedRef.current = false;
            onFullInputChange?.("");
            onCurrentGradesChange?.([]);
            setTimeout(() => textareaRef.current?.focus(), 50);
        }
    }, [phase, words]); // eslint-disable-line react-hooks/exhaustive-deps

    // 단어별 글자 채점
    const gradeWord = useCallback((input, word) => {
        const grades = [];
        for (let i = 0; i < Math.max(input.length, word.length); i++) {
            if (i >= input.length) {
                grades.push('none'); // 미입력
            } else if (i >= word.length) {
                grades.push('incorrect'); // 초과
            } else {
                const inputSep = koreanSeparator(input[i]);
                const wordSep = koreanSeparator(word[i]);
                if (inputSep.length >= wordSep.length) {
                    const isCorrect = areJamoEqual(
                        inputSep.slice(0, wordSep.length),
                        wordSep
                    );
                    if (isCorrect && inputSep.length > wordSep.length) {
                        // 초과 자모 확인
                        const nextIdx = i + 1;
                        if (nextIdx < word.length) {
                            const nextWordSep = koreanSeparator(word[nextIdx]);
                            const extra = inputSep.slice(wordSep.length);
                            const match = areJamoEqual(extra, nextWordSep.slice(0, extra.length));
                            grades.push(match ? 'correct' : 'incorrect');
                        } else {
                            grades.push('incorrect');
                        }
                    } else {
                        grades.push(isCorrect ? 'correct' : 'incorrect');
                    }
                } else {
                    const isPartial = areJamoEqual(inputSep, wordSep.slice(0, inputSep.length));
                    grades.push(isPartial ? 'none' : 'incorrect');
                }
            }
        }
        return grades;
    }, []);

    // 전체 입력에 대한 글자 채점 (InputDisplay용)
    const computeFullGrades = useCallback((input) => {
        const segments = input.split(' ');
        const allGrades = [];

        for (let segIdx = 0; segIdx < segments.length; segIdx++) {
            const segment = segments[segIdx];
            const word = words[segIdx] || '';

            if (segment.length === 0 && segIdx === segments.length - 1) {
                // 마지막 빈 세그먼트 (스페이스 직후)
                break;
            }

            const wordGrades = gradeWord(segment, word);
            allGrades.push(...wordGrades);

            // 단어 사이 스페이스
            if (segIdx < segments.length - 1) {
                allGrades.push('correct');
            }
        }

        return allGrades;
    }, [words, gradeWord]);

    const finishTyping = useCallback((lastWordInput) => {
        const grades = gradeWord(lastWordInput, words[words.length - 1]);
        const elapsedMs = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
        dispatch({
            type: 'FINISH',
            input: lastWordInput,
            charGrades: grades,
            timeMs: 0,
            elapsedMs,
        });

        // 세션 타이핑 카운트 증가
        incrementSessionTypingCount();
    }, [dispatch, gradeWord, words, startTimeRef]);

    const handleInput = (e) => {
        const newValue = e.target.value;

        // 타이머 시작
        if (!startTimeRef.current && newValue.length > 0) {
            startTimeRef.current = Date.now();
        }

        // 스페이스로 분할하여 단어 세그먼트 파악
        const segments = newValue.split(' ');
        const newConfirmedCount = segments.length - 1;
        const oldConfirmedCount = confirmedCountRef.current;

        // 마지막 단어 이후 스페이스 → 완료 처리
        if (newConfirmedCount >= words.length) {
            const lastWordInput = segments[words.length - 1] || '';

            // 마지막 단어 이전까지의 모든 미확정 단어 확정
            for (let i = oldConfirmedCount; i < words.length - 1; i++) {
                const wordText = segments[i];
                const grades = gradeWord(wordText, words[i]);
                dispatch({type: 'CONFIRM_WORD', input: wordText, charGrades: grades, timeMs: 0});
            }

            finishTyping(lastWordInput);
            return;
        }

        setFullInput(newValue);

        // 현재 단어 글자수가 2 이상이면 복귀 차단 플래그 활성화
        const currentSegment = segments[segments.length - 1];
        if (currentSegment.length >= 2) {
            goBackBlockedRef.current = true;
        }

        // 새로 확정된 단어 처리 (스페이스 수 증가)
        if (newConfirmedCount > oldConfirmedCount) {
            for (let i = oldConfirmedCount; i < newConfirmedCount; i++) {
                const wordText = segments[i];
                const grades = gradeWord(wordText, words[i]);
                dispatch({type: 'CONFIRM_WORD', input: wordText, charGrades: grades, timeMs: 0});
            }
            confirmedCountRef.current = newConfirmedCount;
            goBackBlockedRef.current = false; // 새 단어 시작, 플래그 리셋
        }
        // 이전 단어로 복귀 (스페이스 수 감소 = 백스페이스로 스페이스 삭제)
        else if (newConfirmedCount < oldConfirmedCount) {
            for (let i = oldConfirmedCount; i > newConfirmedCount; i--) {
                dispatch({type: 'GO_BACK_WORD'});
            }
            confirmedCountRef.current = newConfirmedCount;
        }

        // 현재 단어 채점 + 전체 채점
        const fullGrades = computeFullGrades(newValue);
        onCurrentGradesChange?.(fullGrades);
        onFullInputChange?.(newValue);
    };

    const handleKeyDown = (e) => {
        // Tab → retry 버튼으로 포커스
        if (e.key === 'Tab') {
            e.preventDefault();
            const retryBtn = document.querySelector('.word-retry-btn');
            if (retryBtn) retryBtn.focus();
            return;
        }

        // Enter, Escape — 완전 차단
        if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();
            return;
        }

        // Backspace — 플래그 활성화 시 이전 단어 복귀 차단
        if (e.key === 'Backspace') {
            const segments = fullInput.split(' ');
            const currentSegment = segments[segments.length - 1];
            if (currentSegment.length === 0 && segments.length > 1 && goBackBlockedRef.current) {
                e.preventDefault();
            }
        }
    };

    const preventPaste = (e) => {
        e.preventDefault();
    };

    return (
        <textarea
            ref={textareaRef}
            className="word-input"
            autoFocus={true}
            autoComplete="off"
            spellCheck={false}
            value={fullInput}
            rows={1}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => onFocusChange?.(true)}
            onBlur={() => onFocusChange?.(false)}
            onPaste={preventPaste}
            onDrop={preventPaste}
            onContextMenu={(e) => e.preventDefault()}
        />
    );
});

export default WordInput;

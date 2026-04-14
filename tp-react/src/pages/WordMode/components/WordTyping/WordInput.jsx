import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from "react";
import {useWord} from "../../context/WordContext";
import {koreanSeparator} from "@/utils/koreanSeparator.ts";
import {createFlatTypoEntry, isLanguageSwitchMistake} from "@/utils/typoUtils.ts";
import {areJamoEqual} from "@/pages/Home/components/Quote/Input/InputUtils";
import {incrementSessionTypingCount} from "@/utils/sessionUtils.ts";
import "./WordInput.css";

const WordInput = forwardRef(({onFullInputChange, onCurrentGradesChange, onFocusChange}, ref) => {
    const {state, dispatch, startTimeRef, wordStartTimeRef} = useWord();
    const {words, phase} = state;

    const [fullInput, setFullInput] = useState("");
    const textareaRef = useRef(null);
    const goBackBlockedRef = useRef(false);

    useImperativeHandle(ref, () => ({
        focus: () => textareaRef.current?.focus(),
    }));
    const confirmedCountRef = useRef(0);

    // 실시간 typo 수집용 refs
    const wordTyposRef = useRef([]);
    const maxCheckedJamoRef = useRef(0);

    // phase 또는 words 변경 시 초기화
    useEffect(() => {
        if (phase === 'typing') {
            setFullInput("");
            confirmedCountRef.current = 0;
            goBackBlockedRef.current = false;
            wordTyposRef.current = [];
            maxCheckedJamoRef.current = 0;
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
                grades.push('none');
            } else if (i >= word.length) {
                grades.push('incorrect');
            } else {
                const inputSep = koreanSeparator(input[i]);
                const wordSep = koreanSeparator(word[i]);
                if (inputSep.length >= wordSep.length) {
                    const isCorrect = areJamoEqual(inputSep.slice(0, wordSep.length), wordSep);
                    if (isCorrect && inputSep.length > wordSep.length) {
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
            if (segment.length === 0 && segIdx === segments.length - 1) break;
            const wordGrades = gradeWord(segment, word);
            // 확정된 단어는 미완성('none')을 오답 처리
            const isConfirmed = segIdx < segments.length - 1;
            if (isConfirmed) {
                allGrades.push(...wordGrades.map(g => g === 'none' ? 'incorrect' : g));
            } else {
                allGrades.push(...wordGrades);
            }
            if (isConfirmed) allGrades.push('correct');
        }
        return allGrades;
    }, [words, gradeWord]);

    // 현재 단어 실시간 typo 감지 (일반 함수)
    const runTypoDetection = (inputSegment, wordIdx) => {
        const word = words[wordIdx];
        if (!word) return;
        const separatedWord = word.split('').map(ch => koreanSeparator(ch));
        const flatWord = separatedWord.flat();
        const flatInput = inputSegment.split('').map(ch => koreanSeparator(ch)).flat();
        const newLen = flatInput.length;

        if (newLen > maxCheckedJamoRef.current) {
            for (let i = maxCheckedJamoRef.current; i < newLen; i++) {
                const exp = flatWord[i];
                const act = flatInput[i];
                if (exp !== undefined && act !== undefined && exp !== act && !isLanguageSwitchMistake(act)) {
                    wordTyposRef.current.push(createFlatTypoEntry(i, exp, act, separatedWord, word));
                }
            }
            maxCheckedJamoRef.current = newLen;
        }
    };

    // 단어 확정 시 typo 수집 + stats 계산 공통 로직
    const collectWordData = (wordText, word, wordIdx) => {
        const grades = gradeWord(wordText, word);
        const finalGrades = grades.map(g => g === 'none' ? 'incorrect' : g);
        const wordTimeMs = wordStartTimeRef.current ? Date.now() - wordStartTimeRef.current : 0;
        const jamoCount = word.split('').reduce((sum, ch) => sum + koreanSeparator(ch).length, 0);
        const cpm = wordTimeMs > 0 ? Math.round(jamoCount / (wordTimeMs / 1000) * 60) : 0;
        const correctCount = finalGrades.slice(0, word.length).filter(g => g === 'correct').length;
        const acc = word.length > 0 ? Math.round(correctCount / word.length * 100) : 0;

        // fallback: 실시간 감지에서 놓친 typo 보완 + 부족 자모
        const separatedWord = word.split('').map(ch => koreanSeparator(ch));
        const flatWord = separatedWord.flat();
        const flatInput = wordText.split('').map(ch => koreanSeparator(ch)).flat();
        const existingKeys = new Set(wordTyposRef.current.map(t => `${t.position}-${t.type}`));
        for (let i = 0; i < flatWord.length; i++) {
            const exp = flatWord[i];
            const act = flatInput[i];
            if (act !== undefined) {
                if (exp !== act && !isLanguageSwitchMistake(act)) {
                    const entry = createFlatTypoEntry(i, exp, act, separatedWord, word);
                    const key = `${entry.position}-${entry.type}`;
                    if (!existingKeys.has(key)) {
                        wordTyposRef.current.push({...entry, wordIndex: wordIdx});
                        existingKeys.add(key);
                    }
                }
            } else {
                // 부족한 자모 (expected: 자모, actual: "")
                const entry = createFlatTypoEntry(i, exp, '', separatedWord, word);
                const key = `${entry.position}-${entry.type}`;
                if (!existingKeys.has(key)) {
                    wordTyposRef.current.push({...entry, wordIndex: wordIdx});
                    existingKeys.add(key);
                }
            }
        }

        const typos = wordTyposRef.current.map(t => ({...t, wordIndex: wordIdx}));
        return {finalGrades, wordTimeMs, cpm, acc, typos};
    };

    // 단어 확정 시 dispatch
    const confirmWord = (wordText, wordIdx) => {
        const {finalGrades, wordTimeMs, cpm, acc, typos} = collectWordData(wordText, words[wordIdx], wordIdx);

        dispatch({
            type: 'CONFIRM_WORD',
            input: wordText,
            charGrades: finalGrades,
            timeMs: wordTimeMs,
            cpm,
            acc,
            typos
        });

        wordStartTimeRef.current = Date.now();
        wordTyposRef.current = [];
        maxCheckedJamoRef.current = 0;
    };

    const finishTyping = (lastWordInput) => {
        const lastWordIdx = words.length - 1;
        const {finalGrades, wordTimeMs, cpm, acc, typos} = collectWordData(lastWordInput, words[lastWordIdx], lastWordIdx);
        const elapsedMs = startTimeRef.current ? Date.now() - startTimeRef.current : 0;

        dispatch({
            type: 'FINISH',
            input: lastWordInput,
            charGrades: finalGrades,
            timeMs: wordTimeMs,
            elapsedMs,
            cpm,
            acc,
            typos,
        });
        incrementSessionTypingCount();
    };

    const handleInput = (e) => {
        const newValue = e.target.value;

        if (!startTimeRef.current && newValue.length > 0) {
            startTimeRef.current = Date.now();
            wordStartTimeRef.current = Date.now();
        }

        const segments = newValue.split(' ');
        const newConfirmedCount = segments.length - 1;
        const oldConfirmedCount = confirmedCountRef.current;

        // 마지막 단어 이후 스페이스 → 완료
        if (newConfirmedCount >= words.length) {
            const lastWordInput = segments[words.length - 1] || '';
            for (let i = oldConfirmedCount; i < words.length - 1; i++) {
                confirmWord(segments[i], i);
            }
            finishTyping(lastWordInput);
            return;
        }

        setFullInput(newValue);

        const currentSegment = segments[segments.length - 1];
        if (currentSegment.length >= 2) {
            goBackBlockedRef.current = true;
        }

        // 새로 확정된 단어
        if (newConfirmedCount > oldConfirmedCount) {
            for (let i = oldConfirmedCount; i < newConfirmedCount; i++) {
                confirmWord(segments[i], i);
            }
            confirmedCountRef.current = newConfirmedCount;
            goBackBlockedRef.current = false;
        }
        // 이전 단어로 복귀
        else if (newConfirmedCount < oldConfirmedCount) {
            for (let i = oldConfirmedCount; i > newConfirmedCount; i--) {
                dispatch({type: 'GO_BACK_WORD'});
            }
            confirmedCountRef.current = newConfirmedCount;
            wordTyposRef.current = [];
            maxCheckedJamoRef.current = 0;
        }

        // 현재 단어 실시간 typo 감지
        runTypoDetection(currentSegment, newConfirmedCount);

        const fullGrades = computeFullGrades(newValue);
        onCurrentGradesChange?.(fullGrades);
        onFullInputChange?.(newValue);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const retryBtn = document.querySelector('.word-retry-btn');
            if (retryBtn) retryBtn.focus();
            return;
        }
        if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();
            return;
        }
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

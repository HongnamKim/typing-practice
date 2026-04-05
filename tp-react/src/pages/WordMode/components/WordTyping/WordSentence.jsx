import {useEffect, useRef} from "react";
import {useSetting} from "@/Context/SettingContext.tsx";
import {useWord} from "../../context/WordContext";
import "./WordSentence.css";

// 초과 입력을 반영한 디스플레이 문자열 생성
function buildDisplaySentence(words, fullInput) {
    if (!fullInput || fullInput.length === 0) return words.join(' ');

    const segments = fullInput.split(' ');
    const parts = [];

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const segment = i < segments.length ? segments[i] : null;

        if (segment && segment.length > word.length) {
            // 초과 입력: 원본 단어 + 초과분 (투명 처리될 자리)
            parts.push(word + segment.slice(word.length));
        } else {
            parts.push(word);
        }
    }

    return parts.join(' ');
}

const WordSentence = ({fullInput, showCaret = true}) => {
    const {fontSize} = useSetting();
    const {state} = useWord();
    const {words} = state;

    const displaySentence = buildDisplaySentence(words, fullInput);
    const inputLength = fullInput?.length || 0;

    const charRefs = useRef([]);
    const caretRef = useRef(null);

    // 커서 위치를 글자 span 기준으로 계산
    useEffect(() => {
        const caretEl = caretRef.current;
        if (!caretEl) return;

        const targetIdx = Math.min(inputLength, displaySentence.length - 1);
        const targetEl = charRefs.current[targetIdx];
        if (!targetEl) return;

        const height = targetEl.offsetHeight;
        const topOffset = targetEl.offsetTop;

        caretEl.style.height = `${height}px`;
        caretEl.style.top = `${topOffset}px`;

        if (inputLength < displaySentence.length) {
            caretEl.style.left = `${targetEl.offsetLeft}px`;
        } else {
            caretEl.style.left = `${targetEl.offsetLeft + targetEl.offsetWidth}px`;
        }
    }, [inputLength, displaySentence.length, fontSize]);

    return (
        <div className="word-sentence-layer" style={{fontSize: `${fontSize}rem`}}>
            <span ref={caretRef} className={`word-caret ${showCaret ? '' : 'word-caret-hidden'}`} />
            {displaySentence.split('').map((char, idx) => (
                <span
                    key={idx}
                    ref={el => charRefs.current[idx] = el}
                    className={idx < inputLength ? 'word-char word-char-typed' : 'word-char word-char-placeholder'}
                >
                    {char}
                </span>
            ))}
        </div>
    );
};

export {buildDisplaySentence};
export default WordSentence;

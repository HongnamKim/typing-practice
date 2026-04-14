import {createContext, ReactNode, useContext, useReducer, useRef} from "react";
import {Difficulty, WordCount, WORD_COUNTS} from "@/utils/wordService";
import {Storage_Word_Difficulty, Storage_Word_Count} from "@/const/config.const";
import type {TypoEntry} from "@/utils/typingRecordApi";

// === Types ===

type CharGrade = 'none' | 'correct' | 'incorrect';

interface WordDetail {
    word: string;
    typed: string;
    correct: boolean;
    timeMs: number;
}

interface WordState {
    // 설정
    difficulty: Difficulty;
    wordCount: WordCount;

    // 단어 데이터
    words: string[];

    // 타이핑 진행
    phase: 'setting' | 'typing' | 'result';
    currentWordIndex: number;
    wordInputs: string[];         // 각 단어별 확정된 입력값
    wordGrades: CharGrade[];      // 단어별 판정
    charGrades: CharGrade[][];    // 단어별 글자별 판정 (확정된 단어)

    // 세션 데이터 (서버 전송 대비)
    typos: TypoEntry[];           // 전체 typo 누적 (히트맵용)
    wordCpms: number[];           // 단어별 CPM
    wordAccs: number[];           // 단어별 정확도 %
    wordTimesMs: number[];        // 단어별 소요 시간

    // 결과
    wpm: number;
    accuracy: number;
    correctWordCount: number;
    wordDetails: WordDetail[];
    elapsedMs: number;
}

type WordAction =
    | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
    | { type: 'SET_WORD_COUNT'; wordCount: WordCount }
    | { type: 'START_TYPING'; words: string[] }
    | { type: 'CONFIRM_WORD'; input: string; charGrades: CharGrade[]; timeMs: number; cpm: number; acc: number; typos: TypoEntry[] }
    | { type: 'GO_BACK_WORD' }
    | { type: 'FINISH'; input: string; charGrades: CharGrade[]; timeMs: number; elapsedMs: number; cpm: number; acc: number; typos: TypoEntry[] }
    | { type: 'RETRY'; words: string[] }
    | { type: 'RESET' };

interface WordContextType {
    state: WordState;
    dispatch: React.Dispatch<WordAction>;
    startTimeRef: React.MutableRefObject<number | null>;
    wordStartTimeRef: React.MutableRefObject<number | null>;
}

// === Initial State ===

const loadInitialDifficulty = (): Difficulty => {
    const saved = localStorage.getItem(Storage_Word_Difficulty);
    if (saved && ['RANDOM', 'EASY', 'NORMAL', 'HARD'].includes(saved)) {
        return saved as Difficulty;
    }
    return 'RANDOM';
};

const loadInitialWordCount = (): WordCount => {
    const saved = localStorage.getItem(Storage_Word_Count);
    const num = Number(saved);
    if (WORD_COUNTS.includes(num as WordCount)) {
        return num as WordCount;
    }
    return 25;
};

const createInitialState = (): WordState => ({
    difficulty: loadInitialDifficulty(),
    wordCount: loadInitialWordCount(),
    words: [],
    phase: 'typing',
    currentWordIndex: 0,
    wordInputs: [],
    wordGrades: [],
    charGrades: [],
    typos: [],
    wordCpms: [],
    wordAccs: [],
    wordTimesMs: [],
    wpm: 0,
    accuracy: 0,
    correctWordCount: 0,
    wordDetails: [],
    elapsedMs: 0,
});

// === Reducer ===

function calculateResult(state: WordState): Pick<WordState, 'wpm' | 'accuracy' | 'correctWordCount' | 'wordDetails' | 'elapsedMs'> {
    const {words, wordInputs, wordGrades, elapsedMs} = state;
    const correctWordCount = wordGrades.filter(g => g === 'correct').length;
    const elapsedSec = elapsedMs / 1000;
    const wpm = elapsedSec > 0 ? Math.round(correctWordCount / (elapsedSec / 60)) : 0;

    // 글자 기준 정확도 (문장 모드와 동일: correct / (correct + incorrect))
    let totalCorrect = 0;
    let totalIncorrect = 0;
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const wordCharGrades = state.charGrades[i] || [];
        for (let j = 0; j < word.length; j++) {
            if (wordCharGrades[j] === 'correct') totalCorrect++;
            else if (wordCharGrades[j] === 'incorrect') totalIncorrect++;
        }
    }
    const checked = totalCorrect + totalIncorrect;
    const accuracy = checked > 0 ? Math.round((totalCorrect / checked) * 100) : 0;

    const wordDetails: WordDetail[] = words.map((word, i) => ({
        word,
        typed: wordInputs[i] || '',
        correct: wordGrades[i] === 'correct',
        timeMs: state.wordTimesMs[i] || 0,
    }));

    return {wpm, accuracy, correctWordCount, wordDetails, elapsedMs};
}

function wordReducer(state: WordState, action: WordAction): WordState {
    switch (action.type) {
        case 'SET_DIFFICULTY':
            localStorage.setItem(Storage_Word_Difficulty, action.difficulty);
            return {...state, difficulty: action.difficulty};

        case 'SET_WORD_COUNT':
            localStorage.setItem(Storage_Word_Count, String(action.wordCount));
            return {...state, wordCount: action.wordCount};

        case 'START_TYPING':
            return {
                ...state,
                words: action.words,
                phase: 'typing',
                currentWordIndex: 0,
                wordInputs: new Array(action.words.length).fill(''),
                wordGrades: new Array(action.words.length).fill('none'),
                charGrades: new Array(action.words.length).fill([]),
                typos: [],
                wordCpms: [],
                wordAccs: [],
                wordTimesMs: [],
                wpm: 0,
                accuracy: 0,
                correctWordCount: 0,
                wordDetails: [],
                elapsedMs: 0,
            };

        case 'CONFIRM_WORD': {
            const {currentWordIndex, words} = state;
            if (currentWordIndex >= words.length) return state;

            const word = words[currentWordIndex];
            const isCorrect = action.input === word;

            const newWordInputs = [...state.wordInputs];
            newWordInputs[currentWordIndex] = action.input;

            const newWordGrades = [...state.wordGrades];
            newWordGrades[currentWordIndex] = isCorrect ? 'correct' : 'incorrect';

            const newCharGrades = [...state.charGrades];
            newCharGrades[currentWordIndex] = [...action.charGrades];

            return {
                ...state,
                wordInputs: newWordInputs,
                wordGrades: newWordGrades,
                charGrades: newCharGrades,
                currentWordIndex: currentWordIndex + 1,
                typos: [...state.typos, ...action.typos],
                wordCpms: [...state.wordCpms, action.cpm],
                wordAccs: [...state.wordAccs, action.acc],
                wordTimesMs: [...state.wordTimesMs, action.timeMs],
            };
        }

        case 'GO_BACK_WORD': {
            if (state.currentWordIndex <= 0) return state;
            const prevIndex = state.currentWordIndex - 1;

            // 이전 단어의 grade를 none으로 리셋
            const newWordGrades = [...state.wordGrades];
            newWordGrades[prevIndex] = 'none';

            return {
                ...state,
                currentWordIndex: prevIndex,
                wordGrades: newWordGrades,
            };
        }

        case 'FINISH': {
            const {currentWordIndex, words} = state;
            if (currentWordIndex >= words.length) return state;

            const word = words[currentWordIndex];
            const isCorrect = action.input === word;

            const newWordInputs = [...state.wordInputs];
            newWordInputs[currentWordIndex] = action.input;

            const newWordGrades = [...state.wordGrades];
            newWordGrades[currentWordIndex] = isCorrect ? 'correct' : 'incorrect';

            const newCharGrades = [...state.charGrades];
            newCharGrades[currentWordIndex] = [...action.charGrades];

            const updatedState: WordState = {
                ...state,
                wordInputs: newWordInputs,
                wordGrades: newWordGrades,
                charGrades: newCharGrades,
                currentWordIndex: currentWordIndex + 1,
                elapsedMs: action.elapsedMs,
                typos: [...state.typos, ...action.typos],
                wordCpms: [...state.wordCpms, action.cpm],
                wordAccs: [...state.wordAccs, action.acc],
                wordTimesMs: [...state.wordTimesMs, action.timeMs],
            };

            const result = calculateResult(updatedState);

            return {
                ...updatedState,
                ...result,
                phase: 'result',
            };
        }

        case 'RETRY':
            return {
                ...state,
                words: action.words,
                phase: 'typing',
                currentWordIndex: 0,
                wordInputs: new Array(action.words.length).fill(''),
                wordGrades: new Array(action.words.length).fill('none'),
                charGrades: new Array(action.words.length).fill([]),
                typos: [],
                wordCpms: [],
                wordAccs: [],
                wordTimesMs: [],
                wpm: 0,
                accuracy: 0,
                correctWordCount: 0,
                wordDetails: [],
                elapsedMs: 0,
            };

        case 'RESET':
            return {...createInitialState(), difficulty: state.difficulty, wordCount: state.wordCount};

        default:
            return state;
    }
}

// === Context ===

const WordContext = createContext<WordContextType | null>(null);

export const useWord = (): WordContextType => {
    const context = useContext(WordContext);
    if (!context) {
        throw new Error('useWord must be used within WordContextProvider');
    }
    return context;
};

interface WordContextProviderProps {
    children: ReactNode;
}

export const WordContextProvider = ({children}: WordContextProviderProps) => {
    const [state, dispatch] = useReducer(wordReducer, null, createInitialState);
    const startTimeRef = useRef<number | null>(null);
    const wordStartTimeRef = useRef<number | null>(null);

    return (
        <WordContext.Provider value={{state, dispatch, startTimeRef, wordStartTimeRef}}>
            {children}
        </WordContext.Provider>
    );
};

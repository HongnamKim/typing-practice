import {createContext, ReactNode, useContext, useReducer, useRef} from "react";
import {Difficulty, WordCount, WORD_COUNTS} from "@/utils/wordService";
import {Storage_Word_Difficulty, Storage_Word_Count} from "@/const/config.const";

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
    | { type: 'CONFIRM_WORD'; input: string; charGrades: CharGrade[]; timeMs: number }
    | { type: 'GO_BACK_WORD' }
    | { type: 'FINISH'; input: string; charGrades: CharGrade[]; timeMs: number; elapsedMs: number }
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

    // 글자 기준 정확도
    let totalChars = 0;
    let correctChars = 0;
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const wordCharGrades = state.charGrades[i] || [];
        // 원본 단어 길이 기준
        for (let j = 0; j < word.length; j++) {
            totalChars++;
            if (wordCharGrades[j] === 'correct') {
                correctChars++;
            }
        }
    }
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;

    const wordDetails: WordDetail[] = words.map((word, i) => ({
        word,
        typed: wordInputs[i] || '',
        correct: wordGrades[i] === 'correct',
        timeMs: 0, // Phase 1에서는 개별 단어 시간 미수집
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

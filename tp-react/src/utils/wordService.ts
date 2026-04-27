import koEasy from '@/data/words/ko-easy.json';
import koNormal from '@/data/words/ko-normal.json';
import koHard from '@/data/words/ko-hard.json';
import {getWords} from './wordApi';
import {LANGUAGE} from '@/const/config.const';

export type Difficulty = 'RANDOM' | 'EASY' | 'NORMAL' | 'HARD';
export const DIFFICULTIES: Difficulty[] = ['RANDOM', 'EASY', 'NORMAL', 'HARD'];
export const WORD_COUNTS = [15, 25, 50] as const;
export type WordCount = typeof WORD_COUNTS[number];

export interface FetchedWords {
    words: string[];
    wordIds: (number | null)[];
}

// Fisher-Yates 셔플
const shuffle = <T, >(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const fetchLocalWords = (difficulty: Difficulty, count: number): FetchedWords => {
    let pool: string[];
    switch (difficulty) {
        case 'EASY':
            pool = koEasy;
            break;
        case 'NORMAL':
            pool = koNormal;
            break;
        case 'HARD':
            pool = koHard;
            break;
        case 'RANDOM':
        default:
            pool = [...koEasy, ...koNormal, ...koHard];
            break;
    }
    const shuffled = shuffle(pool).slice(0, Math.min(count, pool.length));
    return {
        words: shuffled,
        wordIds: shuffled.map(() => null),
    };
};

/**
 * 난이도와 개수에 맞는 단어 목록을 반환한다.
 * 서버 API 우선, 실패 시 로컬 JSON으로 fallback.
 */
export async function fetchWords(difficulty: Difficulty, count: number): Promise<FetchedWords> {
    try {
        const response = await getWords({
            language: LANGUAGE.KOREAN,
            difficulty,
            count,
        });
        const data = response.data.data || [];
        if (data.length === 0) {
            return fetchLocalWords(difficulty, count);
        }
        return {
            words: data.map(w => w.word),
            wordIds: data.map(w => w.wordId),
        };
    } catch (error) {
        console.error('단어 로드 실패, 로컬 JSON 사용:', error);
        return fetchLocalWords(difficulty, count);
    }
}

import koEasy from '@/data/words/ko-easy.json';
import koNormal from '@/data/words/ko-normal.json';
import koHard from '@/data/words/ko-hard.json';

export type Difficulty = 'RANDOM' | 'EASY' | 'NORMAL' | 'HARD';
export const DIFFICULTIES: Difficulty[] = ['RANDOM', 'EASY', 'NORMAL', 'HARD'];
export const WORD_COUNTS = [15, 25, 50] as const;
export type WordCount = typeof WORD_COUNTS[number];

// Fisher-Yates 셔플
const shuffle = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

/**
 * 난이도와 개수에 맞는 단어 목록을 반환한다.
 * Phase 1: 로컬 JSON에서 로드
 * Phase 2: API 호출로 교체
 */
export async function fetchWords(difficulty: Difficulty, count: number): Promise<string[]> {
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

    const shuffled = shuffle(pool);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

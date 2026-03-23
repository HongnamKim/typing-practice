import {TypoEntry, TypoType} from './typingRecordApi';

const KOREAN_START = 44032;
const KOREAN_END = 55203;

const isKoreanChar = (character: string): boolean => {
    const code = character.charCodeAt(0);
    return code >= KOREAN_START && code <= KOREAN_END;
};

/**
 * 한글 자모 분리 결과에서 자모 인덱스로 TypoType을 결정한다.
 * - 초성: index 0
 * - 중성: index 1 ~ (종성 시작 전)
 * - 종성: 나머지
 *
 * 초성은 항상 1개, 중성은 1~2개 (복합 모음), 종성은 0~2개 (복합 종성)
 * separatedSentence 배열에서 초성 1개 + 중성 개수를 알면 종성 시작 위치를 알 수 있다.
 */
const getTypoTypeByJamoIndex = (index: number, medialLength: number): TypoType => {
    if (index === 0) return 'INITIAL';
    if (index < 1 + medialLength) return 'MEDIAL';
    return 'FINAL';
};

/**
 * 중성 자모 개수를 구한다.
 * koreanSeparator의 separateMidChar와 동일한 로직으로,
 * 복합 모음이면 2, 아니면 1을 반환한다.
 */
const getMedialLength = (midIndex: number): number => {
    const compoundMidIndices = [9, 10, 11, 14, 15, 16, 19];
    return compoundMidIndices.includes(midIndex) ? 2 : 1;
};

const getMidIndex = (charCode: number): number => {
    const relativeCode = charCode - KOREAN_START;
    const firstIndex = Math.floor(relativeCode / 588);
    return Math.floor((relativeCode - firstIndex * 588) / 28);
};

/**
 * 두 자모 분리 배열을 비교하여 첫 번째 불일치 자모의 TypoType을 반환한다.
 */
export const determineTypoType = (
    originalChar: string,
    separatedSentence: string[],
    separatedInput: string[],
): TypoType => {
    if (!isKoreanChar(originalChar)) {
        return 'LETTER';
    }

    const midIndex = getMidIndex(originalChar.charCodeAt(0));
    const medialLength = getMedialLength(midIndex);

    // 자모 비교하여 첫 번째 불일치 위치 찾기
    const maxLen = Math.max(separatedSentence.length, separatedInput.length);
    for (let i = 0; i < maxLen; i++) {
        const expected = separatedSentence[i] ?? '';
        const actual = separatedInput[i] ?? '';
        if (expected !== actual) {
            return getTypoTypeByJamoIndex(i, medialLength);
        }
    }

    // 모든 자모가 일치하는데 호출된 경우 (길이 차이 등) — FINAL로 폴백
    return 'FINAL';
};

/**
 * 오타 엔트리를 생성한다.
 */
export const createTypoEntry = (
    originalChar: string,
    separatedSentence: string[],
    separatedInput: string[],
    position: number,
): TypoEntry => {
    const type = determineTypoType(originalChar, separatedSentence, separatedInput);

    // 불일치 자모 찾기
    let expected = originalChar;
    let actual = '';

    const maxLen = Math.max(separatedSentence.length, separatedInput.length);
    for (let i = 0; i < maxLen; i++) {
        const exp = separatedSentence[i] ?? '';
        const act = separatedInput[i] ?? '';
        if (exp !== act) {
            expected = exp || originalChar;
            actual = act || '';
            break;
        }
    }

    return {expected, actual, position, type};
};

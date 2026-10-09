import {describe, expect, it} from 'vitest';
import {validateNickname} from '../src/utils/nicknameValidation';

describe('validateNickname', () => {
    it.each([
        ['ㅋㅋㅋ', '호환용 자음만'],
        ['ㅏㅏ', '호환용 모음만'],
        ['철수ㅋㅋ', '완성형 뒤에 자음'],
        ['ㅋㅋ123', '자음 + 숫자'],
        ['ㅇㅇabc', '자음 + 영문'],
        ['ㅤㅤ', '한글 채움 문자(투명 닉네임)'],
        ['철수ᄀ', '조합용 초성이 남은 경우'],
        ['ﾡﾡ', '반각 자음'],
    ])('rejects standalone Hangul jamo: %s (%s)', (nickname) => {
        expect(validateNickname(nickname)).toBe('nicknameStandaloneJamo');
    });

    it.each([
        ['철수', '완성형 한글'],
        ['김철수12', '한글 + 숫자'],
        ['철수abc', '한글 + 영문'],
        ['さくら', '일본어'],
        ['가나', 'NFD 로 분해된 완성형 (가나)'],
    ])('accepts a nickname without standalone jamo: %s (%s)', (nickname) => {
        expect(validateNickname(nickname)).toBeNull();
    });

    it.each(['가', '가'.repeat(11), '😀'])('rejects a nickname outside 2–10 visible characters: %s', (nickname) => {
        expect(validateNickname(nickname)).toBe('nicknameLength');
    });

    it.each(['가나', '가'.repeat(10), '😀'.repeat(10)])('accepts 2–10 visible characters: %s', (nickname) => {
        expect(validateNickname(nickname)).toBeNull();
    });
});

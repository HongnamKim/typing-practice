const graphemeSegmenter = new Intl.Segmenter(undefined, {granularity: 'grapheme'});

// 완성되지 않은 한글 낱자: 조합용 자모, 호환용 자모(채움 문자 포함), 확장 자모, 반각 자모
const STANDALONE_HANGUL_JAMO = /[ᄀ-ᇿㄱ-ㆎꥠ-꥿ힰ-퟿ﾠ-ￜ]/;

/**
 * 화면에 보이는 글자 단위 길이 (결합 문자, 이모지, 확장 한자 모두 1자)
 */
export const getNicknameLength = (nickname: string): number =>
    Array.from(graphemeSegmenter.segment(nickname.trim())).length;

/**
 * 닉네임 규칙 위반 시 안내 문구의 i18n 키, 통과하면 null
 */
export const validateNickname = (nickname: string): 'nicknameLength' | 'nicknameStandaloneJamo' | null => {
    const length = getNicknameLength(nickname);
    if (length < 2 || length > 10) return 'nicknameLength';
    // NFC 정규화로 조합 가능한 자모를 완성형으로 합친 뒤에도 낱자가 남아 있으면 거부
    if (STANDALONE_HANGUL_JAMO.test(nickname.normalize('NFC'))) return 'nicknameStandaloneJamo';
    return null;
};

import {lang, MONTH_NAMES} from './i18n';

/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷
 */
export const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
};

/**
 * UTC ISO LocalDateTime 문자열을 사용자 로컬 타임존의 Y/M/D 로 포맷.
 * 백엔드가 'Z' 접미사 없이 UTC 시각을 보내므로 명시적으로 'Z' 를 붙여 UTC 로 파싱한다.
 */
export const formatLocalizedDate = (utcIsoString: string): string => {
    const normalized = utcIsoString.endsWith('Z') ? utcIsoString : utcIsoString + 'Z';
    const d = new Date(normalized);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    if (lang === 'ko') return `${y}년 ${m}월 ${day}일`;
    if (lang === 'ja') return `${y}年${m}月${day}日`;
    return `${MONTH_NAMES[m - 1]} ${day}, ${y}`;
};

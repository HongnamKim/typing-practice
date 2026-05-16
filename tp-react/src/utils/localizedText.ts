import {lang} from './i18n';
import {LocalizedText} from '../types/notice.types';

export function localized(text: LocalizedText | null | undefined): string {
    if (!text) return '';
    const value = text[lang];
    if (value !== null && value !== undefined) return value;
    return text.ko;
}

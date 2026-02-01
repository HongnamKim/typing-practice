import apiClient from './apiClient';

/**
 * 공개 문장 업로드
 * @param {string} sentence - 문장 (5-100자)
 * @param {string} [author] - 저자 (1-20자, 선택)
 * @returns {Promise} API 응답
 */
export const uploadPublicQuote = async (sentence, author) => {
    const body = {sentence};
    if (author) {
        body.author = author;
    }
    return apiClient.post('/quotes/public', body);
};

/**
 * 비공개 문장 업로드
 * @param {string} sentence - 문장 (5-100자)
 * @param {string} [author] - 저자 (1-20자, 선택)
 * @returns {Promise} API 응답
 */
export const uploadPrivateQuote = async (sentence, author) => {
    const body = {sentence};
    if (author) {
        body.author = author;
    }
    return apiClient.post('/quotes/private', body);
};

/**
 * 문장 업로드 (타입에 따라 분기)
 * @param {'public' | 'private'} type - 문장 타입
 * @param {string} sentence - 문장 (5-100자)
 * @param {string} [author] - 저자 (1-20자, 선택)
 * @returns {Promise} API 응답
 */
export const uploadQuote = async (type, sentence, author) => {
    if (type === 'public') {
        return uploadPublicQuote(sentence, author);
    }
    return uploadPrivateQuote(sentence, author);
};

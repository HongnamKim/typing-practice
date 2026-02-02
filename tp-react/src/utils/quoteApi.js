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

/**
 * 내 문장 목록 조회
 * @param {Object} params - 쿼리 파라미터
 * @param {number} [params.page=1] - 페이지 번호
 * @param {number} [params.size=10] - 페이지 크기
 * @param {string} [params.type] - PUBLIC, PRIVATE
 * @param {string} [params.status] - PENDING, ACTIVE
 * @returns {Promise} API 응답
 */
export const getMyQuotes = async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);
    if (params.type) queryParams.append('type', params.type);
    if (params.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    return apiClient.get(`/quotes/my${queryString ? `?${queryString}` : ''}`);
};

/**
 * 비공개 문장 수정
 * @param {number} quoteId - 문장 ID
 * @param {Object} data - 수정 데이터
 * @param {string} [data.sentence] - 문장 (5-100자)
 * @param {string} [data.author] - 저자 (1-20자)
 * @returns {Promise} API 응답
 */
export const updateQuote = async (quoteId, data) => {
    return apiClient.patch(`/quotes/${quoteId}`, data);
};

/**
 * 비공개 문장 삭제
 * @param {number} quoteId - 문장 ID
 * @returns {Promise} API 응답
 */
export const deleteQuote = async (quoteId) => {
    return apiClient.delete(`/quotes/${quoteId}`);
};

/**
 * 비공개 → 공개 전환 요청
 * @param {number} quoteId - 문장 ID
 * @returns {Promise} API 응답
 */
export const publishQuote = async (quoteId) => {
    return apiClient.post(`/quotes/${quoteId}/publish`);
};

/**
 * 공개 전환 취소
 * @param {number} quoteId - 문장 ID
 * @returns {Promise} API 응답
 */
export const cancelPublishQuote = async (quoteId) => {
    return apiClient.post(`/quotes/${quoteId}/cancel-publish`);
};

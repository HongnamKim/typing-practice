import apiClient from './apiClient';

/**
 * 문장 신고
 * @param {Object} data - 신고 데이터
 * @param {number} data.quoteId - 신고할 문장 ID
 * @param {string} data.reason - 신고 사유 (MODIFY | DELETE)
 * @param {string} data.detail - 상세 설명 (1-200자)
 * @returns {Promise} API 응답
 */
export const createReport = async (data) => {
    return apiClient.post('/reports', data);
};

/**
 * 내 신고 목록 조회
 * @param {Object} params - 쿼리 파라미터
 * @param {number} [params.page=1] - 페이지 번호
 * @param {number} [params.size=10] - 페이지 크기
 * @param {string} [params.status] - PENDING, PROCESSED
 * @returns {Promise} API 응답
 */
export const getMyReports = async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);
    if (params.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    return apiClient.get(`/reports/my${queryString ? `?${queryString}` : ''}`);
};

/**
 * 내 신고 삭제
 * @param {number} reportId - 신고 ID
 * @returns {Promise} API 응답
 */
export const deleteReport = async (reportId) => {
    return apiClient.delete(`/reports/${reportId}`);
};

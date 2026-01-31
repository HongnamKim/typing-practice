import axios from 'axios';
import {Storage_Refresh_Token} from '../const/config.const';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// accessToken을 저장할 변수 (메모리)
let currentAccessToken = null;

// accessToken 설정 함수
export const setAccessToken = (token) => {
    currentAccessToken = token;
};

// accessToken 가져오기 함수
export const getAccessToken = () => {
    return currentAccessToken;
};

// 요청 인터셉터: 모든 요청에 accessToken 자동 추가
apiClient.interceptors.request.use(
    (config) => {
        if (currentAccessToken) {
            config.headers.Authorization = `Bearer ${currentAccessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 401 에러 시 토큰 갱신 후 재시도
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고, 재시도하지 않은 요청인 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem(Storage_Refresh_Token);

                if (!refreshToken) {
                    // refreshToken이 없으면 로그아웃 처리
                    throw new Error('No refresh token');
                }

                // refreshToken으로 새 accessToken 발급
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken,
                });

                const {accessToken: newAccessToken, refreshToken: newRefreshToken} = response.data.data;

                // 새 토큰 저장
                currentAccessToken = newAccessToken;
                localStorage.setItem(Storage_Refresh_Token, newRefreshToken);

                // 원래 요청의 헤더 업데이트
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // 원래 요청 재시도
                return apiClient(originalRequest);
            } catch (refreshError) {
                // refreshToken도 만료되었거나 재발급 실패
                console.error('Token refresh failed:', refreshError);

                // localStorage 정리
                localStorage.removeItem(Storage_Refresh_Token);
                currentAccessToken = null;

                // 로그아웃 이벤트 발생 (AuthContext에서 감지)
                window.dispatchEvent(new Event('auth:logout'));

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;

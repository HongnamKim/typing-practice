import apiClient from './apiClient';

// Google OAuth 로그인
export const loginWithGoogle = async (code) => {
    const response = await apiClient.post('/auth/google', { code });
    return response.data;
};

// 토큰 갱신
export const refreshAccessToken = async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
};

// 로그아웃
export const logout = async () => {
    await apiClient.post('/auth/logout');
};

// 내 정보 조회
export const getMyInfo = async () => {
    const response = await apiClient.get('/members/me');
    return response.data;
};

// 닉네임 중복 확인
export const checkNickname = async (nickname) => {
    const response = await apiClient.get('/members/check-nickname', {
        params: { nickname },
    });
    return response.data.data; // true: 중복, false: 사용 가능
};

// 닉네임 수정
export const updateNickname = async (nickname) => {
    const response = await apiClient.patch('/members/me', { nickname });
    return response.data;
};
import apiClient from './apiClient';
import {ApiResponse} from '../types/api.types';

// 응답 타입 정의
interface LoginResponse {
    newMember: boolean;
    nickname: string;
    email: string;
    role: string;
    createdAt: string;
    accessToken: string;
    refreshToken: string;
}

interface RefreshResponse {
    accessToken: string;
    refreshToken: string;
}

interface MemberInfo {
    nickname: string;
    email: string;
    role: string;
    createdAt: string;
}

// Google OAuth 로그인
export const loginWithGoogle = async (code: string): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/google', {
        code,
        redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI
    });
    return response.data;
};

// 토큰 갱신
export const refreshAccessToken = async (refreshToken: string): Promise<ApiResponse<RefreshResponse>> => {
    const response = await apiClient.post<ApiResponse<RefreshResponse>>('/auth/refresh', {refreshToken});
    return response.data;
};

// 로그아웃
export const logout = async (): Promise<void> => {
    await apiClient.post('/auth/logout');
};

// 내 정보 조회
export const getMyInfo = async (): Promise<ApiResponse<MemberInfo>> => {
    const response = await apiClient.get<ApiResponse<MemberInfo>>('/members/me');
    return response.data;
};

// 닉네임 중복 확인
export const checkNickname = async (nickname: string): Promise<boolean> => {
    const response = await apiClient.get<ApiResponse<boolean>>('/members/check-nickname', {
        params: {nickname},
    });
    return response.data.data; // true: 중복, false: 사용 가능
};

// 닉네임 수정
export const updateNickname = async (nickname: string): Promise<ApiResponse<MemberInfo>> => {
    const response = await apiClient.patch<ApiResponse<MemberInfo>>('/members/me', {nickname});
    return response.data;
};

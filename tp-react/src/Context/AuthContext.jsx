import React, {createContext, useContext, useState, useEffect} from 'react';
import {refreshAccessToken as refreshTokenApi} from '../utils/authApi';
import {Storage_Refresh_Token} from '../const/config.const';
import {setAccessToken as setApiAccessToken} from '../utils/apiClient';
import apiClient from '../utils/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // 앱 시작 시 자동 로그인
    useEffect(() => {
        const initializeAuth = async () => {
            const storedRefreshToken = localStorage.getItem(Storage_Refresh_Token);
            
            if (storedRefreshToken) {
                try {
                    // 1. refreshToken으로 새 accessToken 발급
                    const refreshResponse = await refreshTokenApi(storedRefreshToken);
                    const {accessToken: newAccessToken, refreshToken: newRefreshToken} = refreshResponse.data;
                    
                    // 2. accessToken을 apiClient에 설정
                    setApiAccessToken(newAccessToken);
                    
                    // 3. accessToken으로 사용자 정보 조회
                    const userInfoResponse = await apiClient.get('/members/me');
                    const userData = userInfoResponse.data.data;
                    
                    setUser({
                        nickname: userData.nickname,
                        email: userData.email,
                        role: userData.role,
                        createdAt: userData.createdAt,
                    });
                    setAccessToken(newAccessToken);
                    setRefreshToken(newRefreshToken);
                    localStorage.setItem(Storage_Refresh_Token, newRefreshToken);
                } catch (error) {
                    console.error('Auto-login failed:', error);
                    // 토큰이 만료되었거나 유효하지 않으면 제거
                    localStorage.removeItem(Storage_Refresh_Token);
                    setApiAccessToken(null);
                }
            }
            
            setIsInitialized(true);
        };

        initializeAuth();
    }, []);

    // auth:logout 이벤트 리스너 (apiClient에서 발생)
    useEffect(() => {
        const handleLogout = () => {
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            localStorage.removeItem(Storage_Refresh_Token);
            setApiAccessToken(null);
        };

        window.addEventListener('auth:logout', handleLogout);
        return () => window.removeEventListener('auth:logout', handleLogout);
    }, []);

    const login = (userData, newAccessToken, newRefreshToken) => {
        setUser(userData);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        
        // apiClient에 accessToken 설정
        setApiAccessToken(newAccessToken);
        
        // refreshToken을 localStorage에 저장
        if (newRefreshToken) {
            localStorage.setItem(Storage_Refresh_Token, newRefreshToken);
        }
    };

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem(Storage_Refresh_Token);
        setApiAccessToken(null);
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{
            user, 
            accessToken, 
            refreshToken,
            isLoading, 
            isInitialized,
            setIsLoading, 
            login, 
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

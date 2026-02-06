import {createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect, useState} from 'react';
import {refreshAccessToken as refreshTokenApi} from '../utils/authApi';
import {Storage_Refresh_Token} from '../const/config.const';
import apiClient, {setAccessToken as setApiAccessToken} from '../utils/apiClient';

interface User {
    nickname: string;
    email: string;
    role: string;
    createdAt: string;
    isNewMember?: boolean;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    isInitialized: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    login: (userData: User, newAccessToken: string, newRefreshToken: string) => void;
    logout: () => void;
    updateUser: (userData: User) => void;
    loginTrigger: number;
    triggerLogin: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const [loginTrigger, setLoginTrigger] = useState<number>(0);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedRefreshToken = localStorage.getItem(Storage_Refresh_Token);

            if (storedRefreshToken) {
                try {
                    const refreshResponse = await refreshTokenApi(storedRefreshToken);
                    const {accessToken: newAccessToken, refreshToken: newRefreshToken} = refreshResponse.data;

                    setApiAccessToken(newAccessToken);

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
                    localStorage.removeItem(Storage_Refresh_Token);
                    setApiAccessToken(null);
                }
            }

            setIsInitialized(true);
        };

        initializeAuth();
    }, []);

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

    const login = (userData: User, newAccessToken: string, newRefreshToken: string) => {
        setUser(userData);
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        setApiAccessToken(newAccessToken);

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

    const updateUser = (userData: User) => {
        setUser(userData);
    };

    const triggerLogin = useCallback(() => {
        setLoginTrigger(prev => prev + 1);
    }, []);

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
            updateUser,
            loginTrigger,
            triggerLogin,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
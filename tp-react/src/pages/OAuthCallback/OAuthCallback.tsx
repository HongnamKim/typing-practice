import {useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '@/Context/AuthContext.tsx';
import {useError} from '@/Context/ErrorContext';
import {loginWithGoogle} from '@/utils/authApi.ts';
import {t} from '@/utils/i18n.ts';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const OAuthCallback = () => {
    const navigate = useNavigate();
    const {login} = useAuth();
    const {showError} = useError();
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;
        processedRef.current = true;

        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');

        if (error) {
            console.error('Google OAuth error:', error);
            showError(t('googleLoginFailed'));
            navigate('/', {replace: true});
            return;
        }

        if (!code) {
            showError(t('googleLoginFailed'));
            navigate('/', {replace: true});
            return;
        }

        const processLogin = async () => {
            try {
                const response = await loginWithGoogle(code);
                const userData = response.data;

                login({
                    nickname: userData.nickname,
                    email: userData.email,
                    role: userData.role,
                    createdAt: userData.createdAt,
                    isNewMember: userData.newMember,
                }, userData.accessToken, userData.refreshToken);

                navigate('/', {replace: true});
            } catch (err) {
                console.error('로그인 실패:', err);
                showError(t('loginFailed'));
                navigate('/', {replace: true});
            }
        };

        processLogin();
    }, []);

    return <LoadingSpinner/>;
};

export default OAuthCallback;

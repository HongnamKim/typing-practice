import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import Title from "./title/Title";
import DarkModeButton from "./themeButton/DarkModeButton";
import LoginButton from "../LoginButton/LoginButton";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import NicknamePopup from "../NicknamePopup/NicknamePopup";
import {useAuth} from "../../Context/AuthContext";
import {useError} from "../../Context/ErrorContext";
import {useGoogleLogin} from "@react-oauth/google";
import {loginWithGoogle} from "@/utils/authApi.ts";
import {t} from "@/utils/i18n.ts";
import {Storage_Last_Mode} from "@/const/config.const.ts";
import FeatureGuide from "../FeatureGuide/FeatureGuide";
import "./Head.css";

// UUID 형식 체크 함수
const isUuidFormat = (str) => {
    if (!str) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

const Head = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {showError} = useError();
    const {user, accessToken, refreshToken, isLoading, setIsLoading, login, loginTrigger} = useAuth();
    const [showNicknamePopup, setShowNicknamePopup] = useState(false);
    const prevLoginTriggerRef = useRef(loginTrigger);

    // user가 변경될 때마다 닉네임이 UUID 형식인지 체크
    useEffect(() => {
        if (user && isUuidFormat(user.nickname)) {
            setShowNicknamePopup(true);
        }
    }, [user]);


    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            setIsLoading(true);
            try {
                const response = await loginWithGoogle(codeResponse.code);

                const userData = response.data;

                login({
                    nickname: userData.nickname,
                    email: userData.email,
                    role: userData.role,
                    createdAt: userData.createdAt,
                    isNewMember: userData.newMember,
                }, userData.accessToken, userData.refreshToken);

                if (isUuidFormat(userData.nickname)) {
                    setShowNicknamePopup(true);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('로그인 실패:', error);
                showError(t('loginFailed'));
                setIsLoading(false);
            }
        },
        onError: (error) => {
            console.error('구글 로그인 실패:', error);
            showError(t('googleLoginFailed'));
        },
    });

    // 다른 컴포넌트에서 로그인 트리거 시 googleLogin 호출
    useEffect(() => {
        if (loginTrigger > 0 && loginTrigger !== prevLoginTriggerRef.current) {
            prevLoginTriggerRef.current = loginTrigger;
            googleLogin();
        }
    }, [loginTrigger, googleLogin]);

    const handleLogin = () => {
        googleLogin();
    };

    const handleNicknameSubmit = (newNickname) => {
        login({
            ...user,
            nickname: newNickname,
            isNewMember: false,
        }, accessToken, refreshToken);
        setShowNicknamePopup(false);
    };

    return (
        <>
            <nav className="head">
                <div className="head-left">
                    <Title/>
                    <div className="nav-links">
                        <button
                            className={`nav-link ${location.pathname === '/' ? 'nav-active' : ''}`}
                            onClick={() => { localStorage.setItem(Storage_Last_Mode, 'sentence'); navigate('/'); }}
                        >
                            {t('sentenceMode')}
                        </button>
                        <button
                            className={`nav-link ${location.pathname === '/word' ? 'nav-active' : ''}`}
                            onClick={() => { localStorage.setItem(Storage_Last_Mode, 'word'); navigate('/word'); }}
                        >
                            {t('wordMode')}<span className="nav-beta">beta</span>
                        </button>
                        <button
                            className={`nav-link ${location.pathname === '/stats' ? 'nav-active' : ''}`}
                            onClick={() => {
                                if (user) {
                                    navigate('/stats');
                                } else {
                                    googleLogin();
                                }
                            }}
                        >
                            {t('records')}
                        </button>
                        <button
                            className={`nav-link ${location.pathname === '/updates' ? 'nav-active' : ''}`}
                            onClick={() => navigate('/updates')}
                        >
                            {t('updateHistory')}
                        </button>
                    </div>
                </div>
                <div className="head-right">
                    {user ? <ProfileDropdown/> : <LoginButton onClick={handleLogin}/>}
                    <DarkModeButton/>
                    {!user && <FeatureGuide/>}
                </div>
            </nav>

            {isLoading && <LoadingSpinner/>}
            {showNicknamePopup && (
                <NicknamePopup
                    initialNickname={user?.nickname}
                    onSubmit={handleNicknameSubmit}
                />
            )}
        </>
    );
};

export default Head;

import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import Title from "./title/Title";
import DarkModeButton from "./themeButton/DarkModeButton";
import LoginButton from "../LoginButton/LoginButton";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import NicknamePopup from "../NicknamePopup/NicknamePopup";
import {useAuth} from "../../Context/AuthContext";
import {useGoogleLogin} from "@react-oauth/google";
import {t} from "@/utils/i18n.ts";
import {Storage_Last_Mode, Session_Login_Redirect} from "@/const/config.const.ts";
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
    const {user, accessToken, refreshToken, isLoading, login, loginTrigger} = useAuth();
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
        ux_mode: 'redirect',
        redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
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
                                    sessionStorage.setItem(Session_Login_Redirect, '/stats');
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

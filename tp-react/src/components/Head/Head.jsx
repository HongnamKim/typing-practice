import React, {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import Title from "./title/Title";
import DarkModeButton from "./themeButton/DarkModeButton";
import LoginButton from "../LoginButton/LoginButton";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import NicknamePopup from "../NicknamePopup/NicknamePopup";
import LoginRequiredPopup from "../LoginRequiredPopup/LoginRequiredPopup";
import {useAuth} from "../../Context/AuthContext";
import {useTheme} from "../../Context/ThemeContext";
import {useError} from "../../Context/ErrorContext";
import {useGoogleLogin} from "@react-oauth/google";
import {loginWithGoogle} from "../../utils/authApi";
import {FaPlus} from "react-icons/fa";
import "./Head.css";

// UUID 형식 체크 함수
const isUuidFormat = (str) => {
    if (!str) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

const Head = () => {
    const navigate = useNavigate();
    const {isDark} = useTheme();
    const {showError} = useError();
    const {user, accessToken, refreshToken, isLoading, setIsLoading, login, loginTrigger} = useAuth();
    const [showNicknamePopup, setShowNicknamePopup] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);
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

                // response.data: { newMember, nickname, accessToken, refreshToken }
                const userData = response.data;
                
                // 신규/기존 회원 모두 바로 로그인 처리
                login({
                    nickname: userData.nickname,
                    email: userData.email,
                    role: userData.role,
                    createdAt: userData.createdAt,
                    isNewMember: userData.newMember,
                }, userData.accessToken, userData.refreshToken);
                
                // UUID 형식 닉네임이면 팝업 표시 (useEffect에서도 처리하지만 즉시 표시를 위해)
                if (isUuidFormat(userData.nickname)) {
                    setShowNicknamePopup(true);
                }
                
                setIsLoading(false);
            } catch (error) {
                console.error('로그인 실패:', error);
                showError('로그인에 실패했습니다. 다시 시도해주세요.');
                setIsLoading(false);
            }
        },
        onError: (error) => {
            console.error('구글 로그인 실패:', error);
            showError('구글 로그인에 실패했습니다.');
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
        // 닉네임 업데이트 + isNewMember false 처리
        login({
            ...user,
            nickname: newNickname,
            isNewMember: false,
        }, accessToken, refreshToken);
        setShowNicknamePopup(false);
    };

    return (
        <>
            <div className="head">
                <Title/>
                <div className="head-right">
                    <button 
                        className={`header-btn ${isDark ? 'dark' : ''}`}
                        onClick={() => {
                            if (user) {
                                navigate('/quote/upload');
                            } else {
                                setShowLoginPopup(true);
                            }
                        }}
                    >
                        <FaPlus/>
                        <span>문장 업로드</span>
                    </button>
                    {user ? <ProfileDropdown/> : <LoginButton onClick={handleLogin}/>}
                    <DarkModeButton/>
                </div>
            </div>

            {isLoading && <LoadingSpinner/>}
            {showNicknamePopup && (
                <NicknamePopup
                    initialNickname={user?.nickname}
                    onSubmit={handleNicknameSubmit}
                />
            )}
            {showLoginPopup && (
                <LoginRequiredPopup
                    message="문장을 업로드하려면 로그인이 필요합니다."
                    onClose={() => setShowLoginPopup(false)}
                />
            )}
        </>
    );
};

export default Head;

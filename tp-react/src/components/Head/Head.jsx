import React, {useState, useEffect} from "react";
import Title from "./title/Title";
import DarkModeButton from "./themeButton/DarkModeButton";
import LoginButton from "../LoginButton/LoginButton";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import NicknamePopup from "../NicknamePopup/NicknamePopup";
import {useAuth} from "../../Context/AuthContext";
import {useGoogleLogin} from "@react-oauth/google";
import {loginWithGoogle} from "../../utils/authApi";
import "./Head.css";

// UUID 형식 체크 함수
const isUuidFormat = (str) => {
    if (!str) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
};

const Head = () => {
    const {user, accessToken, refreshToken, isLoading, setIsLoading, login} = useAuth();
    const [showNicknamePopup, setShowNicknamePopup] = useState(false);

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
                alert('로그인에 실패했습니다. 다시 시도해주세요.');
                setIsLoading(false);
            }
        },
        onError: (error) => {
            console.error('구글 로그인 실패:', error);
            alert('구글 로그인에 실패했습니다.');
        },
    });

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
        </>
    );
};

export default Head;

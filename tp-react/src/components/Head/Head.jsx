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
import {Storage_Last_Mode, Session_Login_Redirect, Storage_Last_Seen_Notice_Id, Storage_Last_Seen_Update_Note_Id} from "@/const/config.const.ts";
import FeatureGuide from "../FeatureGuide/FeatureGuide";
import NavBadge from "./NavBadge";
import {getLatestAnnouncement} from "@/utils/noticeApi.ts";
import {getLatestUpdateNote} from "@/utils/updateNoteApi.ts";
import "./Head.css";

const shouldShowBadge = (latest, storedId) => {
    if (!latest) return false;
    if (!storedId) return true;
    return String(latest.id) !== storedId;
};

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
    const [latestAnnouncementId, setLatestAnnouncementId] = useState(null);
    const [latestUpdateNoteId, setLatestUpdateNoteId] = useState(null);
    const [showNoticeBadge, setShowNoticeBadge] = useState(false);
    const [showUpdateBadge, setShowUpdateBadge] = useState(false);

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

    // 마운트 시 /latest 두 API 호출 → 뱃지 표시 여부 판단
    useEffect(() => {
        const fetchBadgeData = async () => {
            try {
                const [n, u] = await Promise.all([getLatestAnnouncement(), getLatestUpdateNote()]);
                setLatestAnnouncementId(n?.id ?? null);
                setLatestUpdateNoteId(u?.id ?? null);
                const storedNoticeId = localStorage.getItem(Storage_Last_Seen_Notice_Id);
                const storedUpdateId = localStorage.getItem(Storage_Last_Seen_Update_Note_Id);
                setShowNoticeBadge(shouldShowBadge(n, storedNoticeId));
                setShowUpdateBadge(shouldShowBadge(u, storedUpdateId));
            } catch {
                // silent fail — 뱃지 미표시
            }
        };
        fetchBadgeData();
    }, []);

    // 페이지 진입 시 본 것으로 간주 → localStorage 저장 + 뱃지 숨김
    useEffect(() => {
        if (location.pathname === '/updates' && latestUpdateNoteId !== null) {
            localStorage.setItem(Storage_Last_Seen_Update_Note_Id, String(latestUpdateNoteId));
            setShowUpdateBadge(false);
        }
        if (location.pathname === '/notices' && latestAnnouncementId !== null) {
            localStorage.setItem(Storage_Last_Seen_Notice_Id, String(latestAnnouncementId));
            setShowNoticeBadge(false);
        }
    }, [location.pathname, latestAnnouncementId, latestUpdateNoteId]);

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
                            {t('wordMode')}
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
                            <NavBadge show={showUpdateBadge} />
                        </button>
                        <button
                            className={`nav-link ${location.pathname === '/notices' ? 'nav-active' : ''}`}
                            onClick={() => navigate('/notices')}
                        >
                            {t('noticeMenu')}
                            <NavBadge show={showNoticeBadge} />
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

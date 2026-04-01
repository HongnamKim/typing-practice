import {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import "./AverageScorePopUp.css";
import {useScore} from "@/Context/ScoreContext.tsx";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useAuth} from "@/Context/AuthContext.tsx";
import {getTypingStats} from "@/utils/statsApi.ts";
import {t} from "@/utils/i18n.ts";

const AverageScorePopUp = () => {
    const {showPopup, setShowPopup, popupData} = useScore();
    const {isDark} = useTheme();
    const {user, triggerLogin} = useAuth();
    const navigate = useNavigate();
    const cumulativeStatsRef = useRef(null);
    const fetchedRef = useRef(false);

    // 로그인 사용자: 누적 통계를 한 번만 가져옴
    useEffect(() => {
        if (user && !fetchedRef.current) {
            fetchedRef.current = true;
            getTypingStats('KOREAN')
                .then(res => {
                    cumulativeStatsRef.current = res.data.data;
                })
                .catch(() => {});
        }
        if (!user) {
            fetchedRef.current = false;
            cumulativeStatsRef.current = null;
        }
    }, [user]);

    if (!showPopup) {
        return null;
    }

    const handleBackgroundClick = () => {
        setShowPopup(false);
    };

    const handleLoginClick = () => {
        setShowPopup(false);
        triggerLogin();
    };

    const handleViewStats = () => {
        setShowPopup(false);
        navigate('/stats');
    };

    const cumulative = cumulativeStatsRef.current;
    const cpmDiff = cumulative && cumulative.totalAttempts > 0
        ? popupData.avgCpm - Math.round(cumulative.avgCpm)
        : null;

    return (
        <>
            <div className="popup-background" onClick={handleBackgroundClick}/>
            <div className={`popup ${isDark ? "popup-dark" : ""}`}>
                {/* 메인: Avg CPM */}
                <div className="popup-main">
                    <span className="popup-main-label">Session result</span>
                    <div className="popup-main-row">
                        <span className="popup-main-value">{popupData.avgCpm}</span>
                        <span className="popup-main-unit">Avg CPM</span>
                        {user && cpmDiff !== null && (
                            <span className={`popup-main-diff ${cpmDiff > 0 ? 'up' : cpmDiff < 0 ? 'down' : 'neutral'}`}>
                                {cpmDiff > 0 ? `+${cpmDiff}` : cpmDiff === 0 ? '±0' : cpmDiff} vs avg
                            </span>
                        )}
                    </div>
                </div>

                {/* 보조 통계 */}
                <div className="popup-details">
                    <div className="popup-detail-row">
                        <span className="popup-detail-label">Max CPM</span>
                        <span className="popup-detail-value">{popupData.maxCpm}</span>
                    </div>
                    <div className="popup-detail-row">
                        <span className="popup-detail-label">Accuracy</span>
                        <span className="popup-detail-value">{popupData.acc}%</span>
                    </div>
                    {user && cumulative && cumulative.totalAttempts > 0 && (
                        <div className="popup-detail-row">
                            <span className="popup-detail-label">{t('popupCumulativeAvg')}</span>
                            <span className="popup-detail-value cumulative">{Math.round(cumulative.avgCpm)} CPM</span>
                        </div>
                    )}
                </div>

                <div className="popup-bottom">
                    {user && (
                        <button className="popup-stats-link" onClick={handleViewStats}>
                            {t('popupViewStats')}
                        </button>
                    )}
                    {!user && (
                        <button className="popup-login-prompt" onClick={handleLoginClick}>
                            {t('popupLoginPrompt')}
                        </button>
                    )}
                    <div className="popup-close">
                        <span>press ESC to continue</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AverageScorePopUp;

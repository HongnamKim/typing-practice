import {useEffect, useRef, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useScore} from "@/Context/ScoreContext.tsx";
import {useTheme} from "@/Context/ThemeContext.tsx";
import {useAuth} from "@/Context/AuthContext.tsx";
import {getTypingStats} from "@/utils/statsApi.ts";
import {LANGUAGE} from "@/const/config.const";
import {t} from "@/utils/i18n.ts";
import {VscDebugRestart} from "react-icons/vsc";
import SessionChart from "../AverageScorePopUp/SessionChart";
import KeyboardHeatmap from "@/pages/Stats/components/KeyboardHeatmap";
import "./SessionResult.css";

const SessionResult = ({onClose}) => {
    const {popupData, popupCpmList, popupAccList, popupTypos} = useScore();
    const {isDark} = useTheme();
    const {user, triggerLogin} = useAuth();
    const navigate = useNavigate();
    const cumulativeStatsRef = useRef(null);
    const fetchedRef = useRef(false);
    const retryBtnRef = useRef(null);

    // 로그인 사용자: 누적 통계 한 번만 가져오기
    useEffect(() => {
        if (user && !fetchedRef.current) {
            fetchedRef.current = true;
            getTypingStats(LANGUAGE.KOREAN)
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

    const handleContinue = useCallback(() => {
        onClose?.();
    }, [onClose]);

    // Tab → retry 버튼으로 직접 포커스, Enter → 다음 세션, ESC → 다음 세션
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                retryBtnRef.current?.focus();
                return;
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                handleContinue();
                return;
            }
            if (e.key === 'Enter' && document.activeElement === retryBtnRef.current) {
                e.preventDefault();
                handleContinue();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleContinue]);

    const handleLoginClick = () => {
        triggerLogin();
    };

    const handleViewStats = () => {
        navigate('/stats');
    };

    const cumulative = cumulativeStatsRef.current;
    const cpmDiff = cumulative && cumulative.totalAttempts > 0
        ? popupData.avgCpm - Math.round(cumulative.avgCpm)
        : null;

    return (
        <div className={`session-result ${isDark ? 'session-result-dark' : ''}`}>
            {/* 메인: Avg CPM */}
            <div className="session-result-main">
                <span className="session-result-main-label">Session result</span>
                <div className="session-result-main-row">
                    <span className="session-result-main-value">{popupData.avgCpm}</span>
                    <span className="session-result-main-unit">Avg CPM</span>
                    {user && cpmDiff !== null && (
                        <span className={`session-result-main-diff ${cpmDiff > 0 ? 'up' : cpmDiff < 0 ? 'down' : 'neutral'}`}>
                            {cpmDiff > 0 ? `+${cpmDiff}` : cpmDiff === 0 ? '±0' : cpmDiff} vs avg
                        </span>
                    )}
                </div>
            </div>

            {/* 보조 통계 */}
            <div className="session-result-details">
                <div className="session-result-detail-row">
                    <span className="session-result-detail-label">Max CPM</span>
                    <span className="session-result-detail-value">{popupData.maxCpm}</span>
                </div>
                <div className="session-result-detail-row">
                    <span className="session-result-detail-label">Accuracy</span>
                    <span className="session-result-detail-value">{popupData.acc}%</span>
                </div>
                {user && cumulative && cumulative.totalAttempts > 0 && (
                    <div className="session-result-detail-row">
                        <span className="session-result-detail-label">{t('popupCumulativeAvg')}</span>
                        <span className="session-result-detail-value cumulative">{Math.round(cumulative.avgCpm)} CPM</span>
                    </div>
                )}
            </div>

            {/* 세션 차트 + 히트맵 */}
            {popupCpmList.length > 0 && (
                <div className="session-result-session">
                    <div>
                        <div className="session-result-section-title">{t('sessionTrend')}</div>
                        <SessionChart cpmList={popupCpmList} accList={popupAccList}/>
                    </div>
                    <div>
                        <div className="session-result-section-title">{t('keyboardHeatmap')}</div>
                        <KeyboardHeatmap externalTypos={popupTypos} compact/>
                    </div>
                </div>
            )}

            {/* 하단 */}
            <div className="session-result-bottom">
                {user && (
                    <button className="session-result-stats-link" onClick={handleViewStats}>
                        {t('popupViewStats')}
                    </button>
                )}
                {!user && (
                    <button className="session-result-login-prompt" onClick={handleLoginClick}>
                        {t('popupLoginPrompt')}
                    </button>
                )}
                <button
                    ref={retryBtnRef}
                    className="session-result-retry-btn"
                    onClick={handleContinue}
                    title={t('retry')}
                >
                    <VscDebugRestart/>
                </button>
                <span className="session-result-hint">{t('retryHint')}</span>
            </div>
        </div>
    );
};

export default SessionResult;

import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FaRotateRight} from 'react-icons/fa6';
import {useAuth} from '../../Context/AuthContext';
import {useError} from '../../Context/ErrorContext';
import {getDailyStats, getTypingStats, getTypoStats, refreshStats} from '@/utils/statsApi.ts';
import {t} from '@/utils/i18n.ts';
import StatsSummary from './components/StatsSummary';
import DailyChart from './components/DailyChart';
import TypoList from './components/TypoList';
import KeyboardHeatmap from './components/KeyboardHeatmap';
import './Stats.css';

function Stats() {
    const navigate = useNavigate();
    const {user, isInitialized} = useAuth();
    const {showError} = useError();

    const [typingStats, setTypingStats] = useState(null);
    const [dailyStats, setDailyStats] = useState([]);
    const [typoStats, setTypoStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dailyRange, setDailyRange] = useState(7);

    // 비로그인 시 홈으로
    useEffect(() => {
        if (isInitialized && !user) {
            navigate('/');
        }
    }, [user, isInitialized, navigate]);

    // 데이터 로드
    useEffect(() => {
        if (!user) return;
        loadAllStats();
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    // dailyRange 변경 시 일별 통계 재조회
    useEffect(() => {
        if (!user) return;
        loadDailyStats();
    }, [dailyRange]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAllStats = async () => {
        setIsLoading(true);
        try {
            const [typingRes, dailyRes, typoRes] = await Promise.all([
                getTypingStats('KOREAN'),
                getDailyStats('KOREAN', dailyRange),
                getTypoStats('KOREAN'),
            ]);
            setTypingStats(typingRes.data.data);
            setDailyStats(dailyRes.data.data.content || []);
            setTypoStats(typoRes.data.data.content || []);
        } catch (error) {
            console.error('통계 로드 실패:', error);
            if (error?.response?.status !== 401) {
                showError(t('statsLoadFailed'));
            }
        } finally {
            setIsLoading(false);
        }
    };

    const loadDailyStats = async () => {
        try {
            const res = await getDailyStats('KOREAN', dailyRange);
            setDailyStats(res.data.data.content || []);
        } catch (error) {
            console.error('일별 통계 로드 실패:', error);
        }
    };

    const handleRefresh = async () => {
        try {
            const res = await refreshStats('KOREAN');
            setTypingStats(res.data.data);
            await loadAllStats();
        } catch (error) {
            if (error.response?.status === 429) {
                showError(t('refreshCooldown'));
            } else if (error?.response?.status !== 401) {
                showError(t('refreshFailed'));
            }
        }
    };

    if (!isInitialized) return null;
    if (!user) return null;

    return (
        <div className="stats-container">
            <div className="stats-header">
                <h1 className="stats-title">{t('myTypingRecords')}</h1>
                <button className="stats-refresh-btn" onClick={handleRefresh} title="새로고침">
                    <FaRotateRight/>
                </button>
            </div>

            {isLoading ? (
                <div className="stats-loading">
                    <div className="stats-spinner"></div>
                </div>
            ) : (
                <>
                    {/* 종합 통계 */}
                    <StatsSummary typingStats={typingStats} dailyStats={dailyStats}/>

                    {/* 일별 추이 */}
                    <DailyChart dailyStats={dailyStats} dailyRange={dailyRange} onRangeChange={setDailyRange}/>

                    {/* 오타 통계 + 키보드 히트맵 */}
                    <div className="stats-bottom-grid">
                        <TypoList typoStats={typoStats}/>
                        <KeyboardHeatmap/>
                    </div>
                </>
            )}
        </div>
    );
}

export default Stats;

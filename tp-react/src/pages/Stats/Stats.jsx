import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FaRotateRight} from 'react-icons/fa6';
import {useAuth} from '../../Context/AuthContext';
import {useError} from '../../Context/ErrorContext';
import {getDailyStats, getTypingStats, getTypoStats, refreshStats} from '@/utils/statsApi.ts';
import {
    getWordDailyStats,
    getWordTypingStats,
    getWordTypoStats,
    getWordTypoDetailStats,
    refreshWordStats,
} from '@/utils/wordStatsApi.ts';
import {LANGUAGE} from '@/const/config.const';
import {Storage_Last_Mode} from '@/const/config.const.ts';
import {t} from '@/utils/i18n.ts';
import StatsSummary from './components/StatsSummary';
import WordStatsSummary from './components/WordStatsSummary';
import DailyChart from './components/DailyChart';
import WordDailyChart from './components/WordDailyChart';
import TypoList from './components/TypoList';
import KeyboardHeatmap from './components/KeyboardHeatmap';
import './Stats.css';

function Stats() {
    const navigate = useNavigate();
    const {user, isInitialized} = useAuth();
    const {showError} = useError();

    const [mode, setMode] = useState(() => {
        const lastMode = localStorage.getItem(Storage_Last_Mode);
        return lastMode === 'word' ? 'word' : 'sentence';
    });
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

    // 데이터 로드 (mode 변경 시 재조회)
    useEffect(() => {
        if (!user) return;
        loadAllStats();
    }, [user, mode]); // eslint-disable-line react-hooks/exhaustive-deps

    // dailyRange 변경 시 일별 통계 재조회
    useEffect(() => {
        if (!user) return;
        loadDailyStats();
    }, [dailyRange, mode]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAllStats = async () => {
        setIsLoading(true);
        try {
            if (mode === 'word') {
                const [typingRes, dailyRes, typoRes] = await Promise.all([
                    getWordTypingStats(LANGUAGE.KOREAN),
                    getWordDailyStats(LANGUAGE.KOREAN, dailyRange),
                    getWordTypoStats(LANGUAGE.KOREAN),
                ]);
                setTypingStats(typingRes.data.data);
                setDailyStats(dailyRes.data.data.content || []);
                setTypoStats(typoRes.data.data.content || []);
            } else {
                const [typingRes, dailyRes, typoRes] = await Promise.all([
                    getTypingStats(LANGUAGE.KOREAN),
                    getDailyStats(LANGUAGE.KOREAN, dailyRange),
                    getTypoStats(LANGUAGE.KOREAN),
                ]);
                setTypingStats(typingRes.data.data);
                setDailyStats(dailyRes.data.data.content || []);
                setTypoStats(typoRes.data.data.content || []);
            }
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
            if (mode === 'word') {
                const res = await getWordDailyStats(LANGUAGE.KOREAN, dailyRange);
                setDailyStats(res.data.data.content || []);
            } else {
                const res = await getDailyStats(LANGUAGE.KOREAN, dailyRange);
                setDailyStats(res.data.data.content || []);
            }
        } catch (error) {
            console.error('일별 통계 로드 실패:', error);
        }
    };

    const handleRefresh = async () => {
        try {
            const refreshFn = mode === 'word' ? refreshWordStats : refreshStats;
            const res = await refreshFn(LANGUAGE.KOREAN);
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
                <div className="stats-mode-toggle">
                    <button
                        className={`stats-mode-btn ${mode === 'sentence' ? 'active' : ''}`}
                        onClick={() => setMode('sentence')}
                    >
                        {t('sentenceMode')}
                    </button>
                    <button
                        className={`stats-mode-btn ${mode === 'word' ? 'active' : ''}`}
                        onClick={() => setMode('word')}
                    >
                        {t('wordMode')}
                    </button>
                </div>
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
                    {mode === 'word' ? (
                        <WordStatsSummary typingStats={typingStats} dailyStats={dailyStats}/>
                    ) : (
                        <StatsSummary typingStats={typingStats} dailyStats={dailyStats}/>
                    )}

                    {/* 일별 추이 */}
                    {mode === 'word' ? (
                        <WordDailyChart dailyStats={dailyStats} dailyRange={dailyRange} onRangeChange={setDailyRange}/>
                    ) : (
                        <DailyChart dailyStats={dailyStats} dailyRange={dailyRange} onRangeChange={setDailyRange}/>
                    )}

                    {/* 오타 통계 + 키보드 히트맵 */}
                    <div className="stats-bottom-grid">
                        <TypoList typoStats={typoStats}/>
                        <KeyboardHeatmap
                            fetchTypoDetail={mode === 'word' ? (ch) => getWordTypoDetailStats(LANGUAGE.KOREAN, ch) : undefined}
                            key={mode}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default Stats;

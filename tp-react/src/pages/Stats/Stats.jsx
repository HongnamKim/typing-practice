import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {FaRotateRight} from 'react-icons/fa6';
import {useAuth} from '../../Context/AuthContext';
import {useError} from '../../Context/ErrorContext';
import {getAllTypoStats, getDailyStats, getTypingStats, refreshStats} from '@/utils/statsApi.ts';
import {
    getWordDailyStats,
    getWordTypingStats,
    getAllWordTypoStats,
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

// 단어 모드 히트맵에서 키를 눌렀을 때 쓰는 글자별 상세 조회
const fetchWordTypoDetail = (ch) => getWordTypoDetailStats(LANGUAGE.KOREAN, ch);

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
    const [isLoadingTyping, setIsLoadingTyping] = useState(true);
    const [isLoadingDaily, setIsLoadingDaily] = useState(true);
    const [isLoadingTypo, setIsLoadingTypo] = useState(true);
    const [dailyRange, setDailyRange] = useState(7);

    // 비로그인 시 홈으로
    useEffect(() => {
        if (isInitialized && !user) {
            navigate('/');
        }
    }, [user, isInitialized, navigate]);

    // 누적/오타 통계 로드 (mode 변경 시 재조회). 일별 통계는 아래 이펙트에서 로드
    useEffect(() => {
        if (!user) return;
        // mode 변경 시 이전 데이터 초기화 (mode 간 데이터 구조 차이로 인한 NaN 방지)
        setTypingStats(null);
        setDailyStats([]);
        setTypoStats([]);
        loadTypingStats();
        loadTypoStats();
    }, [user, mode]); // eslint-disable-line react-hooks/exhaustive-deps

    // 일별 통계 로드 (user, mode, dailyRange 변경 시)
    useEffect(() => {
        if (!user) return;
        loadDailyStats();
    }, [user, dailyRange, mode]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadAllStats = () => {
        loadTypingStats();
        loadDailyStats();
        loadTypoStats();
    };

    const loadTypingStats = async () => {
        setIsLoadingTyping(true);
        try {
            const fetcher = mode === 'word' ? getWordTypingStats : getTypingStats;
            const res = await fetcher(LANGUAGE.KOREAN);
            setTypingStats(res.data.data);
        } catch (error) {
            console.error('누적 통계 로드 실패:', error);
            if (error?.response?.status !== 401) {
                showError(t('statsLoadFailed'));
            }
        } finally {
            setIsLoadingTyping(false);
        }
    };

    const loadDailyStats = async () => {
        setIsLoadingDaily(true);
        try {
            const fetcher = mode === 'word' ? getWordDailyStats : getDailyStats;
            const res = await fetcher(LANGUAGE.KOREAN, dailyRange);
            setDailyStats(res.data.data.content || []);
        } catch (error) {
            console.error('일별 통계 로드 실패:', error);
        } finally {
            setIsLoadingDaily(false);
        }
    };

    const loadTypoStats = async () => {
        setIsLoadingTypo(true);
        try {
            // 자주 틀리는 글자 목록과 키보드 히트맵이 같은 데이터를 쓴다
            const fetcher = mode === 'word' ? getAllWordTypoStats : getAllTypoStats;
            const res = await fetcher(LANGUAGE.KOREAN);
            setTypoStats(res.data.data.content.typos || []);
        } catch (error) {
            console.error('오타 통계 로드 실패:', error);
        } finally {
            setIsLoadingTypo(false);
        }
    };

    const handleRefresh = async () => {
        try {
            const refreshFn = mode === 'word' ? refreshWordStats : refreshStats;
            const res = await refreshFn(LANGUAGE.KOREAN);
            setTypingStats(res.data.data);
            loadAllStats();
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
                        {t('statsSentenceMode')}
                    </button>
                    <button
                        className={`stats-mode-btn ${mode === 'word' ? 'active' : ''}`}
                        onClick={() => setMode('word')}
                    >
                        {t('statsWordMode')}
                    </button>
                </div>
                <button className="stats-refresh-btn" onClick={handleRefresh} title="새로고침">
                    <FaRotateRight/>
                </button>
            </div>

            {/* 종합 통계 */}
            {mode === 'word' ? (
                <WordStatsSummary typingStats={typingStats} dailyStats={dailyStats} isLoading={isLoadingTyping}/>
            ) : (
                <StatsSummary typingStats={typingStats} dailyStats={dailyStats} isLoading={isLoadingTyping}/>
            )}

            {/* 일별 추이 */}
            {mode === 'word' ? (
                <WordDailyChart dailyStats={dailyStats} dailyRange={dailyRange} onRangeChange={setDailyRange} isLoading={isLoadingDaily}/>
            ) : (
                <DailyChart dailyStats={dailyStats} dailyRange={dailyRange} onRangeChange={setDailyRange} isLoading={isLoadingDaily}/>
            )}

            {/* 오타 통계 + 키보드 히트맵 */}
            <div className="stats-bottom-grid">
                <TypoList typoStats={typoStats} isLoading={isLoadingTypo}/>
                <KeyboardHeatmap
                    typoStats={typoStats}
                    isLoading={isLoadingTypo}
                    fetchTypoDetail={mode === 'word' ? fetchWordTypoDetail : undefined}
                    key={mode}
                />
            </div>
        </div>
    );
}

export default Stats;

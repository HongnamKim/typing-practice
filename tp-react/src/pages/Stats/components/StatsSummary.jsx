import './StatsSummary.css';

const formatTime = (min) => {
    if (!min || min <= 0) return '0분';
    const h = Math.floor(min / 60);
    const m = Math.round(min % 60);
    return h > 0 ? h + '시간 ' + m + '분' : m + '분';
};

const calcTrend = (recentAvg, totalAvg) => {
    if (!totalAvg || !recentAvg) return {text: '', className: ''};
    const roundedRecent = Math.round(recentAvg);
    const roundedTotal = Math.round(totalAvg);
    if (roundedRecent === roundedTotal) return {text: '\u2014 0%', className: 'stats-trend neutral'};
    const percent = ((roundedRecent - roundedTotal) / roundedTotal * 100).toFixed(1);
    if (percent > 0) return {text: '\u25B2 ' + percent + '%', className: 'stats-trend up'};
    if (percent < 0) return {text: '\u25BC ' + Math.abs(percent) + '%', className: 'stats-trend down'};
    return {text: '\u2014 0%', className: 'stats-trend neutral'};
};

const calcRecentAvgCpm = (dailyStats) => {
    if (!dailyStats || dailyStats.length === 0) return 0;
    let totalWeighted = 0;
    let totalAttempts = 0;
    for (let i = 0; i < dailyStats.length; i++) {
        totalWeighted += dailyStats[i].avgCpm * dailyStats[i].attempts;
        totalAttempts += dailyStats[i].attempts;
    }
    return totalAttempts > 0 ? Math.round(totalWeighted / totalAttempts) : 0;
};

function StatsSummary({typingStats, dailyStats}) {
    if (!typingStats) return null;

    const recentAvg = calcRecentAvgCpm(dailyStats);
    const trend = calcTrend(recentAvg, typingStats.avgCpm);
    const avgReset = typingStats.totalAttempts > 0
        ? (typingStats.totalResetCount / typingStats.totalAttempts).toFixed(2)
        : '0';

    return (
        <div className="stats-summary">
            <div className="stats-main-card">
                <span className="stats-main-label">최근 7일 평균</span>
                <div className="stats-main-value">
                    <span className="stats-main-number">{recentAvg}</span>
                    <span className="stats-main-unit">CPM</span>
                    {trend.text && <span className={trend.className}>{trend.text}</span>}
                </div>
                <div className="stats-main-sub">
                    최고 {typingStats.bestCpm} CPM · 정확도 {Math.round(typingStats.avgAcc * 100)}%
                </div>
            </div>
            <div className="stats-sub-grid">
                <div className="stats-sub-card">
                    <span className="stats-sub-label">연습 시간</span>
                    <div className="stats-sub-value">{formatTime(typingStats.totalPracticeTimeMin)}</div>
                </div>
                <div className="stats-sub-card">
                    <span className="stats-sub-label">연습 횟수</span>
                    <div className="stats-sub-value">
                        {typingStats.totalAttempts}<span className="stats-sub-unit">회</span>
                    </div>
                </div>
                <div className="stats-sub-card">
                    <span className="stats-sub-label">전체 평균</span>
                    <div className="stats-sub-value">
                        {Math.round(typingStats.avgCpm)}<span className="stats-sub-unit">CPM</span>
                    </div>
                </div>
                <div className="stats-sub-card">
                    <span className="stats-sub-label">평균 초기화</span>
                    <div className="stats-sub-value">
                        {avgReset}<span className="stats-sub-unit">회</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatsSummary;
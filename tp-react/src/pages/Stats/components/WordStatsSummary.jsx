import {t} from '@/utils/i18n.ts';
import './StatsSummary.css';

const formatTime = t('formatTime');

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

const calcRecentAvgWpm = (dailyStats) => {
    if (!dailyStats || dailyStats.length === 0) return 0;
    let totalWeighted = 0;
    let totalAttempts = 0;
    for (let i = 0; i < dailyStats.length; i++) {
        totalWeighted += dailyStats[i].avgWpm * dailyStats[i].attempts;
        totalAttempts += dailyStats[i].attempts;
    }
    return totalAttempts > 0 ? Math.round(totalWeighted / totalAttempts) : 0;
};

function WordStatsSummary({typingStats, dailyStats}) {
    if (!typingStats) return null;

    const recentAvg = calcRecentAvgWpm(dailyStats);
    const trend = calcTrend(recentAvg, typingStats.avgWpm);
    const trendText = trend.text ? trend.text.replace('▲ ', '+').replace('▼ ', '-') + ' ' + t('vsOverall') : '';

    return (
        <div className="stats-summary">
            <div className="stats-item">
                <span className="stats-label">{t('recent7DayAvg')}</span>
                <div className="stats-value">
                    <span className="stats-number">{recentAvg}</span>
                    {trendText && <span className={trend.className}>{trendText}</span>}
                </div>
            </div>
            <div className="stats-item">
                <span className="stats-label">{t('totalAverage')}</span>
                <div className="stats-value">
                    <span className="stats-number">{Math.round(typingStats.avgWpm)}</span>
                    <span className="stats-unit">WPM</span>
                </div>
            </div>
            <div className="stats-item">
                <span className="stats-label">{t('totalWordsAttempted')}</span>
                <div className="stats-value">
                    <span className="stats-number">{typingStats.totalWordsAttempted}</span>
                </div>
            </div>
            <div className="stats-item">
                <span className="stats-label">{t('practiceCount')}</span>
                <div className="stats-value">
                    <span className="stats-number">{typingStats.totalAttempts}</span>
                </div>
            </div>
            <div className="stats-item">
                <span className="stats-label">{t('practiceTime')}</span>
                <div className="stats-value">
                    <span className="stats-number">{formatTime(typingStats.totalPracticeTimeMin)}</span>
                </div>
            </div>
        </div>
    );
}

export default WordStatsSummary;

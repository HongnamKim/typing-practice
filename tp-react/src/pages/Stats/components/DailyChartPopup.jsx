import {t} from '@/utils/i18n.ts';

const formatPopupTitle = t('formatPopupTitle');
const formatTime = t('formatTime');

const DailyChartPopup = ({data, metric, style}) => {
    const rows = [
        {label: t('attempts'), value: data.attempts + t('countUnit')},
        {label: t('practiceTime'), value: formatTime(data.practiceTimeMin)},
        {label: t('avgSpeed'), value: Math.round(data.avgCpm) + ' CPM', highlight: metric === 'cpm'},
        {label: t('bestSpeed'), value: data.bestCpm + ' CPM'},
        {label: t('avgAccuracy'), value: Math.round(data.avgAcc * 100) + '%', highlight: metric === 'acc'},
        {label: t('avgResetCount'), value: (data.attempts > 0 ? (data.resetCount / data.attempts).toFixed(2) : '0') + t('countUnit')},
    ];

    return (
        <div className="daily-chart-popup" style={style}>
            <div className="daily-chart-popup-header">
                <span className="daily-chart-popup-title">{formatPopupTitle(data.date)}</span>
                <span className="daily-chart-popup-dot"/>
            </div>
            <div className="daily-chart-popup-divider"/>
            <div className="daily-chart-popup-list">
                {rows.map((row, i) => (
                    <div className="daily-chart-popup-row" key={i}>
                        <span className="daily-chart-popup-label">{row.label}</span>
                        <span className={`daily-chart-popup-value${row.highlight ? ' highlight' : ''}`}>{row.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyChartPopup;
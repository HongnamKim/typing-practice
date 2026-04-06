import {useState, useRef, useCallback} from 'react';
import {t} from '@/utils/i18n.ts';
import './DailyChart.css';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const formatDateLabel = (dateStr) => {
    const parts = dateStr.split('-');
    return MONTH_NAMES[parseInt(parts[1]) - 1] + ' ' + parseInt(parts[2]);
};

const formatPopupTitle = t('formatPopupTitle');
const formatTime = t('formatTime');

const SVG_W = 600;
const SVG_H = 180;
const PAD = {left: 48, right: 16, top: 24, bottom: 28};
const CHART_W = SVG_W - PAD.left - PAD.right;
const CHART_H = SVG_H - PAD.top - PAD.bottom;
const GRID_COUNT = 4;

function DailyChart({dailyStats, dailyRange, onRangeChange}) {
    const [metric, setMetric] = useState('cpm');
    const [hoverIndex, setHoverIndex] = useState(null);
    const [popupData, setPopupData] = useState(null);
    const [popupPos, setPopupPos] = useState({x: 0, y: 0});
    const chartRef = useRef(null);
    const svgRef = useRef(null);

    const data = dailyStats || [];
    const values = data.map(d => metric === 'cpm' ? d.avgCpm : Math.round(d.avgAcc * 100));
    const maxVal = values.length > 0 ? Math.max(...values) : 0;
    const minVal = values.length > 0 ? Math.min(...values) : 0;
    const padding = (maxVal - minVal) * 0.1 || 5;
    const yMax = metric === 'acc' ? Math.min(maxVal + padding, 100) : maxVal + padding;
    const yMin = minVal - padding;
    const yRange = yMax - yMin || 1;

    const points = data.map((d, i) => {
        const x = data.length > 1 ? PAD.left + (i / (data.length - 1)) * CHART_W : PAD.left + CHART_W / 2;
        const y = PAD.top + CHART_H - ((values[i] - yMin) / yRange) * CHART_H;
        return {x, y};
    });

    const linePoints = points.map(p => p.x + ',' + p.y).join(' ');
    const areaPoints = points.length > 0
        ? PAD.left + ',' + (PAD.top + CHART_H) + ' ' + linePoints + ' ' + points[points.length - 1].x + ',' + (PAD.top + CHART_H)
        : '';

    const gridLines = [];
    for (let g = 0; g <= GRID_COUNT; g++) {
        const gy = PAD.top + (g / GRID_COUNT) * CHART_H;
        const gVal = Math.round(yMax - (g / GRID_COUNT) * yRange);
        gridLines.push({y: gy, label: metric === 'cpm' ? gVal : gVal + '%'});
    }

    const labelInterval = data.length > 14 ? Math.ceil(data.length / 6) : 1;

    const handleMouseEnter = useCallback((e, i) => {
        setHoverIndex(i);
        setPopupData(data[i]);
        if (chartRef.current) {
            const circle = e.target.getBoundingClientRect();
            const area = chartRef.current.getBoundingClientRect();
            setPopupPos({
                x: circle.left - area.left + circle.width / 2 + 8,
                y: circle.top - area.top + circle.height / 2 + 20,
            });
        }
    }, [data]);

    const handleMouseLeave = useCallback(() => {
        setHoverIndex(null);
        setPopupData(null);
    }, []);

    return (
        <div className="daily-chart-section">
            <div className="daily-chart-header">
                <h3 className="daily-chart-title">{t('dailyTrend')}</h3>
                <div className="daily-chart-tabs">
                    <button className={'daily-chart-tab' + (metric === 'cpm' ? ' active' : '')} onClick={() => setMetric('cpm')}>CPM</button>
                    <button className={'daily-chart-tab' + (metric === 'acc' ? ' active' : '')} onClick={() => setMetric('acc')}>{t('accuracyTab')}</button>
                    <span className="daily-chart-tab-divider"/>
                    <button className={'daily-chart-tab' + (dailyRange === 7 ? ' active' : '')} onClick={() => onRangeChange(7)}>{t('days')(7)}</button>
                    <button className={'daily-chart-tab' + (dailyRange === 30 ? ' active' : '')} onClick={() => onRangeChange(30)}>{t('days')(30)}</button>
                </div>
            </div>
            {data.length === 0 ? (
                <div className="daily-chart-empty">{t('noData')}</div>
            ) : (
                <div className="daily-chart-area" ref={chartRef}>
                    <svg ref={svgRef} width="100%" height={SVG_H} viewBox={'0 0 ' + SVG_W + ' ' + SVG_H}>
                        {gridLines.map((gl, i) => (
                            <g key={i}>
                                <line x1={PAD.left} y1={gl.y} x2={SVG_W - PAD.right} y2={gl.y} className="daily-chart-grid"/>
                                <text x={PAD.left - 8} y={gl.y + 4} className="daily-chart-grid-label">{gl.label}</text>
                            </g>
                        ))}
                        {areaPoints && data.length > 1 && <polygon points={areaPoints} className="daily-chart-fill"/>}
                        {linePoints && data.length > 1 && <polyline points={linePoints} className="daily-chart-line"/>}
                        {points.map((p, i) => {
                            const showLabel = (i % labelInterval === 0) || (i === data.length - 1);
                            let textAnchor = 'middle';
                            if (showLabel && i === 0) textAnchor = 'start';
                            else if (showLabel && i === data.length - 1) textAnchor = 'end';
                            const displayVal = metric === 'cpm' ? Math.round(values[i]) : values[i] + '%';
                            return (
                                <g key={i}>
                                    <circle cx={p.x} cy={p.y} r={hoverIndex === i ? 6 : 4} className="daily-chart-dot"/>
                                    <g className="daily-chart-tooltip" style={{opacity: hoverIndex === i ? 1 : 0}}>
                                        <rect x={p.x - 28} y={p.y - 32} width={56} height={24} rx={4} className="daily-chart-tooltip-bg"/>
                                        <text x={p.x} y={p.y - 16} className="daily-chart-tooltip-text">{displayVal}</text>
                                    </g>
                                    <circle cx={p.x} cy={p.y} r={16} style={{fill: 'transparent', cursor: 'pointer'}}
                                        onMouseEnter={(e) => handleMouseEnter(e, i)} onMouseLeave={handleMouseLeave}/>
                                    {showLabel && (
                                        <text x={p.x} y={PAD.top + CHART_H + 16} className="daily-chart-date-label" textAnchor={textAnchor}>
                                            {formatDateLabel(data[i].date)}
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                    {popupData && (
                        <div className="daily-chart-popup" style={{left: popupPos.x, top: popupPos.y}}>
                            <div className="daily-chart-popup-title">{formatPopupTitle(popupData.date)}</div>
                            <div className="daily-chart-popup-grid">
                                <div className="daily-chart-popup-item">
                                    <span className="daily-chart-popup-label">{t('attempts')}</span>
                                    <span className="daily-chart-popup-value">{popupData.attempts + t('countUnit')}</span>
                                </div>
                                <div className="daily-chart-popup-item">
                                    <span className="daily-chart-popup-label">{t('practiceTime')}</span>
                                    <span className="daily-chart-popup-value">{formatTime(popupData.practiceTimeMin)}</span>
                                </div>
                                <div className="daily-chart-popup-item">
                                    <span className="daily-chart-popup-label">{t('avgSpeed')}</span>
                                    <span className="daily-chart-popup-value">{Math.round(popupData.avgCpm) + ' CPM'}</span>
                                </div>
                                <div className="daily-chart-popup-item">
                                    <span className="daily-chart-popup-label">{t('bestSpeed')}</span>
                                    <span className="daily-chart-popup-value">{popupData.bestCpm + ' CPM'}</span>
                                </div>
                                <div className="daily-chart-popup-item">
                                    <span className="daily-chart-popup-label">{t('avgAccuracy')}</span>
                                    <span className="daily-chart-popup-value">{Math.round(popupData.avgAcc * 100) + '%'}</span>
                                </div>
                                <div className="daily-chart-popup-item">
                                    <span className="daily-chart-popup-label">{t('avgResetCount')}</span>
                                    <span className="daily-chart-popup-value">{(popupData.attempts > 0 ? (popupData.resetCount / popupData.attempts).toFixed(2) : '0') + t('countUnit')}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default DailyChart;
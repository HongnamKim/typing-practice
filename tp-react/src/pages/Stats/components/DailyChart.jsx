import {useCallback, useEffect, useRef, useState} from 'react';
import {Area, AreaChart, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import {t} from '@/utils/i18n.ts';
import {formatDateLabel, computeAxis} from './dailyChartUtils';
import DailyChartDot from './DailyChartDot';
import DailyChartPopup from './DailyChartPopup';
import './DailyChart.css';

function DailyChart({dailyStats, dailyRange, onRangeChange}) {
    const [metric, setMetric] = useState('cpm');
    const [hoverIndex, setHoverIndex] = useState(null);
    const [lockedIndex, setLockedIndex] = useState(null);
    const [popupPos, setPopupPos] = useState({x: 0, y: 0});
    const sectionRef = useRef(null);
    const activeIndex = lockedIndex ?? hoverIndex;

    const data = (dailyStats || []).map((d, i, arr) => ({
        ...d,
        displayDate: formatDateLabel(d.date, i > 0 ? arr[i - 1].date : null),
        value: metric === 'cpm' ? Math.round(d.avgCpm) : Math.round(d.avgAcc * 100),
    }));

    const {domain, ticks} = data.length > 0 ? computeAxis(data, metric) : {domain: [0, 100], ticks: [0, 25, 50, 75, 100]};

    const updatePopupPos = useCallback((e) => {
        if (sectionRef.current) {
            const circle = e.target.getBoundingClientRect();
            const section = sectionRef.current.getBoundingClientRect();
            const popupWidth = 280;
            let x = circle.left - section.left + circle.width / 2 + 8;
            const y = circle.top - section.top + circle.height / 2 + 20;
            const overflow = x + popupWidth - section.width;
            if (overflow > 0) x -= overflow + 16;
            setPopupPos({x, y});
        }
    }, []);

    const handleDotEnter = useCallback((e, index) => {
        setHoverIndex(index);
        if (lockedIndex === null) updatePopupPos(e);
    }, [lockedIndex, updatePopupPos]);

    const handleDotLeave = useCallback(() => {
        setHoverIndex(null);
    }, []);

    const handleDotClick = useCallback((e, index) => {
        if (lockedIndex === index) {
            setLockedIndex(null);
        } else {
            setLockedIndex(index);
            updatePopupPos(e);
        }
    }, [lockedIndex, updatePopupPos]);

    useEffect(() => {
        if (lockedIndex === null) return;
        const handleDocClick = () => setLockedIndex(null);
        document.addEventListener('click', handleDocClick);
        return () => document.removeEventListener('click', handleDocClick);
    }, [lockedIndex]);

    return (
        <div className="daily-chart-section" ref={sectionRef}>
            <div className="daily-chart-header">
                <h3 className="daily-chart-title">{t('dailyTrend')}</h3>
                <div className="daily-chart-tabs">
                    <div className="daily-chart-toggle-group">
                        <button className={'daily-chart-toggle' + (metric === 'cpm' ? ' active' : '')} onClick={() => setMetric('cpm')}>CPM</button>
                        <button className={'daily-chart-toggle' + (metric === 'acc' ? ' active' : '')} onClick={() => setMetric('acc')}>{t('accuracyTab')}</button>
                    </div>
                    <div className="daily-chart-toggle-group">
                        <button className={'daily-chart-toggle' + (dailyRange === 7 ? ' active' : '')} onClick={() => onRangeChange(7)}>{t('days')(7)}</button>
                        <button className={'daily-chart-toggle' + (dailyRange === 30 ? ' active' : '')} onClick={() => onRangeChange(30)}>{t('days')(30)}</button>
                    </div>
                </div>
            </div>
            {data.length === 0 ? (
                <div className="daily-chart-empty">{t('noData')}</div>
            ) : (
                <>
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={data} margin={{top: 16, right: 16, bottom: 8, left: 0}}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="displayDate" tick={{fontSize: 10, fontWeight: 700, fill: 'var(--color-text-placeholder)'}} axisLine={false} tickLine={false} dy={8}/>
                        <YAxis domain={domain} ticks={ticks} tick={{fontSize: 10, fontWeight: 700, fill: 'var(--color-text-placeholder)'}} axisLine={false} tickLine={false} tickFormatter={v => metric === 'acc' ? v + '%' : v} width={44} allowDecimals={false}/>
                        <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={1.5} fill="url(#colorValue)"
                              dot={(props) => <DailyChartDot {...props} activeIndex={activeIndex} metric={metric} onDotEnter={handleDotEnter} onDotLeave={handleDotLeave} onDotClick={handleDotClick}/>}
                              activeDot={false}/>
                    </AreaChart>
                </ResponsiveContainer>
                {activeIndex !== null && data[activeIndex] && (
                    <DailyChartPopup data={data[activeIndex]} metric={metric} style={{position: 'absolute', left: popupPos.x, top: popupPos.y}}/>
                )}
                </>
            )}
        </div>
    );
}

export default DailyChart;
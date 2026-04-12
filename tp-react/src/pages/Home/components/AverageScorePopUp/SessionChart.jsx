import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip} from 'recharts';
import {computeAxis} from '@/pages/Stats/components/dailyChartUtils';
import './SessionChart.css';

const CustomTooltip = ({active, payload, label}) => {
    if (!active || !payload || payload.length === 0) return null;
    return (
        <div className="session-chart-tooltip">
            <div className="session-chart-tooltip-row">
                <span className="session-chart-tooltip-label">#{label}</span>
            </div>
            {payload.map((p, i) => (
                <div key={i} className="session-chart-tooltip-row">
                    <span className="session-chart-tooltip-label">{p.name}</span>
                    <span className="session-chart-tooltip-value" style={{color: p.color}}>
                        {p.name === 'ACC' ? p.value + '%' : p.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

function SessionChart({cpmList, accList}) {
    if (!cpmList || cpmList.length === 0) return null;

    const data = cpmList.map((cpm, i) => ({
        index: i + 1,
        CPM: Math.round(cpm),
        ACC: accList[i] != null ? Math.round(accList[i]) : null,
    }));

    const cpmAxis = computeAxis(data.map(d => ({value: d.CPM})), 'cpm');
    const accAxis = computeAxis(data.filter(d => d.ACC != null).map(d => ({value: d.ACC})), 'acc');

    return (
        <div className="session-chart">
            <ResponsiveContainer width="100%" height={120}>
                <LineChart data={data} margin={{top: 8, right: 8, bottom: 0, left: 0}}>
                    <XAxis dataKey="index" tick={{fontSize: 10, fill: 'var(--color-text-placeholder)'}} axisLine={false} tickLine={false}/>
                    <YAxis yAxisId="cpm" domain={cpmAxis.domain} ticks={cpmAxis.ticks} tick={{fontSize: 10, fill: 'var(--color-text-placeholder)'}} axisLine={false} tickLine={false} width={40}/>
                    <YAxis yAxisId="acc" orientation="right" domain={accAxis.domain} ticks={accAxis.ticks} tick={{fontSize: 10, fill: 'var(--color-text-placeholder)'}} axisLine={false} tickLine={false} tickFormatter={v => v + '%'} width={40}/>
                    <Tooltip content={<CustomTooltip/>} cursor={false}/>
                    <Line yAxisId="cpm" type="monotone" dataKey="CPM" stroke="var(--color-primary)" strokeWidth={1.5} dot={{r: 3, fill: 'var(--color-primary)', strokeWidth: 0}} activeDot={{r: 5}}/>
                    <Line yAxisId="acc" type="monotone" dataKey="ACC" stroke="var(--color-success)" strokeWidth={1.5} dot={{r: 3, fill: 'var(--color-success)', strokeWidth: 0}} activeDot={{r: 5}}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default SessionChart;

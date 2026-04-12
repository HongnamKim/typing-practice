const DailyChartDot = ({cx, cy, index, activeIndex, payload, metric, onDotEnter, onDotLeave, onDotClick}) => {
    const isActive = index === activeIndex;
    const displayValue = payload?.value;
    return (
        <g>
            <circle cx={cx} cy={cy} r={isActive ? 6 : 4} fill="var(--color-primary)" stroke="var(--color-popup-bg)" strokeWidth={2}/>
            {isActive && displayValue != null && (
                <g>
                    <rect x={cx - 28} y={cy - 32} width={56} height={24} rx={4}
                          fill="var(--color-popup-bg)" stroke="var(--color-border)" strokeWidth={0.5}/>
                    <text x={cx} y={cy - 16} textAnchor="middle" fontSize={13} fontWeight={600}
                          fill="var(--color-text)">{metric === 'acc' ? displayValue + '%' : displayValue}</text>
                </g>
            )}
            <circle cx={cx} cy={cy} r={16} fill="transparent" style={{cursor: 'pointer'}}
                    onMouseEnter={(e) => onDotEnter(e, index)}
                    onMouseLeave={onDotLeave}
                    onClick={(e) => { e.stopPropagation(); onDotClick(e, index); }}/>
        </g>
    );
};

export default DailyChartDot;
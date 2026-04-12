const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatDateLabel = (dateStr, prevDateStr) => {
    const parts = dateStr.split('-');
    const day = parseInt(parts[2]);
    if (!prevDateStr) {
        return MONTH_NAMES[parseInt(parts[1]) - 1] + ' ' + day;
    }
    const prevParts = prevDateStr.split('-');
    if (parts[1] !== prevParts[1]) {
        return MONTH_NAMES[parseInt(parts[1]) - 1] + ' ' + day;
    }
    return String(day);
};

const niceStep = (range) => {
    const rough = range / 4;
    const mag = Math.pow(10, Math.floor(Math.log10(rough)));
    const norm = rough / mag;
    if (norm <= 1) return mag;
    if (norm <= 2) return 2 * mag;
    if (norm <= 5) return 5 * mag;
    return 10 * mag;
};

export const computeAxis = (data, metric) => {
    const vals = data.map(d => d.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const s = metric === 'acc' ? Math.max(niceStep(range), 2) : niceStep(range);
    const lo = Math.floor((min - s * 0.5) / s) * s;
    const hi = metric === 'acc' ? Math.min(Math.ceil((max + s * 0.5) / s) * s, 100) : Math.ceil((max + s * 0.5) / s) * s;
    const ticks = [];
    for (let v = lo; v <= hi; v += s) ticks.push(v);
    return {domain: [lo, hi], ticks};
};

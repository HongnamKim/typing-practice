/* eslint-disable no-undef */
// ===========================================
// 통계 페이지
// ===========================================

// Mock Data
var mockTypingStats = {
    totalAttempts: 247,
    avgCpm: 342.5,
    avgAcc: 0.94,
    bestCpm: 512,
    totalPracticeTimeMin: 186.3,
    totalResetCount: 41
};
var mockDailyStats = [
    {date: '2026-02-23', attempts: 10, avgCpm: 290, avgAcc: 0.88, bestCpm: 380, resetCount: 6, practiceTimeMin: 14.5},
    {date: '2026-02-24', attempts: 14, avgCpm: 305, avgAcc: 0.90, bestCpm: 400, resetCount: 5, practiceTimeMin: 19.2},
    {date: '2026-02-25', attempts: 6, avgCpm: 280, avgAcc: 0.87, bestCpm: 370, resetCount: 3, practiceTimeMin: 8.8},
    {date: '2026-02-27', attempts: 16, avgCpm: 310, avgAcc: 0.91, bestCpm: 420, resetCount: 7, practiceTimeMin: 22.1},
    {date: '2026-02-28', attempts: 9, avgCpm: 295, avgAcc: 0.89, bestCpm: 385, resetCount: 4, practiceTimeMin: 13.0},
    {date: '2026-03-01', attempts: 20, avgCpm: 315, avgAcc: 0.92, bestCpm: 430, resetCount: 8, practiceTimeMin: 27.5},
    {date: '2026-03-02', attempts: 11, avgCpm: 300, avgAcc: 0.90, bestCpm: 410, resetCount: 5, practiceTimeMin: 15.8},
    {date: '2026-03-03', attempts: 7, avgCpm: 288, avgAcc: 0.88, bestCpm: 375, resetCount: 3, practiceTimeMin: 10.2},
    {date: '2026-03-05', attempts: 18, avgCpm: 320, avgAcc: 0.93, bestCpm: 440, resetCount: 6, practiceTimeMin: 24.3},
    {date: '2026-03-06', attempts: 13, avgCpm: 325, avgAcc: 0.92, bestCpm: 435, resetCount: 5, practiceTimeMin: 18.0},
    {date: '2026-03-07', attempts: 8, avgCpm: 308, avgAcc: 0.91, bestCpm: 415, resetCount: 4, practiceTimeMin: 11.5},
    {date: '2026-03-09', attempts: 22, avgCpm: 330, avgAcc: 0.93, bestCpm: 450, resetCount: 9, practiceTimeMin: 30.2},
    {date: '2026-03-10', attempts: 15, avgCpm: 335, avgAcc: 0.94, bestCpm: 455, resetCount: 6, practiceTimeMin: 21.0},
    {date: '2026-03-11', attempts: 5, avgCpm: 310, avgAcc: 0.90, bestCpm: 410, resetCount: 2, practiceTimeMin: 7.3},
    {date: '2026-03-12', attempts: 19, avgCpm: 340, avgAcc: 0.94, bestCpm: 465, resetCount: 7, practiceTimeMin: 26.5},
    {date: '2026-03-13', attempts: 12, avgCpm: 328, avgAcc: 0.93, bestCpm: 445, resetCount: 5, practiceTimeMin: 17.2},
    {date: '2026-03-15', attempts: 17, avgCpm: 345, avgAcc: 0.95, bestCpm: 470, resetCount: 6, practiceTimeMin: 23.8},
    {date: '2026-03-16', attempts: 10, avgCpm: 332, avgAcc: 0.93, bestCpm: 448, resetCount: 4, practiceTimeMin: 14.0},
    {date: '2026-03-18', attempts: 12, avgCpm: 310, avgAcc: 0.91, bestCpm: 420, resetCount: 5, practiceTimeMin: 18.2},
    {date: '2026-03-19', attempts: 18, avgCpm: 325, avgAcc: 0.93, bestCpm: 445, resetCount: 7, practiceTimeMin: 25.5},
    {date: '2026-03-20', attempts: 8, avgCpm: 298, avgAcc: 0.89, bestCpm: 390, resetCount: 4, practiceTimeMin: 12.3},
    {date: '2026-03-21', attempts: 22, avgCpm: 340, avgAcc: 0.95, bestCpm: 478, resetCount: 8, practiceTimeMin: 30.1},
    {date: '2026-03-22', attempts: 15, avgCpm: 355, avgAcc: 0.94, bestCpm: 490, resetCount: 6, practiceTimeMin: 22.7},
    {date: '2026-03-23', attempts: 20, avgCpm: 360, avgAcc: 0.96, bestCpm: 512, resetCount: 3, practiceTimeMin: 28.4},
    {date: '2026-03-24', attempts: 5, avgCpm: 348, avgAcc: 0.93, bestCpm: 465, resetCount: 2, practiceTimeMin: 8.6}
];
var mockTypoStats = [
    {expected: 'ㅔ', count: 34}, {expected: 'ㅐ', count: 28}, {expected: 'ㄱ', count: 19},
    {expected: 'ㅂ', count: 15}, {expected: 'ㅈ', count: 12}, {expected: 'ㅌ', count: 10},
    {expected: 'ㅎ', count: 8}, {expected: 'ㄷ', count: 7}, {expected: 'ㅍ', count: 5}, {expected: 'ㅊ', count: 3}
];
var mockTypoDetail = {
    'ㅔ': [{expected: 'ㅔ', actual: 'ㅐ', typoCount: 22}, {expected: 'ㅔ', actual: 'ㅓ', typoCount: 8}, {
        expected: 'ㅔ',
        actual: 'ㅣ',
        typoCount: 4
    }],
    'ㅐ': [{expected: 'ㅐ', actual: 'ㅔ', typoCount: 18}, {expected: 'ㅐ', actual: 'ㅏ', typoCount: 10}],
    'ㄱ': [{expected: 'ㄱ', actual: 'ㅋ', typoCount: 12}, {expected: 'ㄱ', actual: 'ㄲ', typoCount: 7}]
};

var statsChartMetric = 'cpm';
var statsDailyRange = 7;
var statsSelectedTypo = null;

function openStatsPage() {
    document.getElementById('statsPage').classList.remove('display-none');
    document.body.style.overflow = 'hidden';
    // 네비게이션 활성 상태 업데이트
    document.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });
    document.getElementById('navStats').classList.add('active');
    renderStats();
}

function closeStatsPage() {
    document.getElementById('statsPage').classList.add('display-none');
    document.body.style.overflow = '';
    // 네비게이션 활성 상태 복원
    document.querySelectorAll('.nav-link').forEach(function(l) { l.classList.remove('active'); });
    document.getElementById('navSentence').classList.add('active');
}

function renderStats() {
    renderSummary();
    renderChart();
    renderTypoList();
}

function renderSummary() {
    var s = mockTypingStats;
    document.getElementById('statsTotalAttempts').textContent = s.totalAttempts;
    document.getElementById('statsAvgCpm').textContent = Math.round(s.avgCpm);
    document.getElementById('statsAvgAcc').textContent = Math.round(s.avgAcc * 100);
    document.getElementById('statsBestCpm').textContent = s.bestCpm;
    var avgResetPerAttempt = s.totalAttempts > 0 ? (s.totalResetCount / s.totalAttempts) : 0;
    document.getElementById('statsResetCount').textContent = avgResetPerAttempt.toFixed(2);
    var h = Math.floor(s.totalPracticeTimeMin / 60);
    var m = Math.round(s.totalPracticeTimeMin % 60);
    document.getElementById('statsTotalTime').textContent = h > 0 ? h + '시간 ' + m + '분' : m + '분';

    // 최근 7일 평균 CPM 계산
    var recentData = mockDailyStats.slice(-7);
    var recentTotal = 0;
    var recentCount = 0;
    for (var i = 0; i < recentData.length; i++) {
        recentTotal += recentData[i].avgCpm * recentData[i].attempts;
        recentCount += recentData[i].attempts;
    }
    var recentAvg = recentCount > 0 ? Math.round(recentTotal / recentCount) : 0;
    document.getElementById('statsRecentCpm').textContent = recentAvg;

    // 추세 계산 (전체 평균 대비)
    var trendEl = document.getElementById('statsTrend');
    if (s.avgCpm > 0 && recentAvg > 0) {
        var changePercent = ((recentAvg - s.avgCpm) / s.avgCpm * 100).toFixed(1);
        if (changePercent > 0) {
            trendEl.textContent = '\u25B2 ' + changePercent + '%';
            trendEl.className = 'stats-trend up';
        } else if (changePercent < 0) {
            trendEl.textContent = '\u25BC ' + Math.abs(changePercent) + '%';
            trendEl.className = 'stats-trend down';
        } else {
            trendEl.textContent = '\u2014 0%';
            trendEl.className = 'stats-trend neutral';
        }
    } else {
        trendEl.textContent = '';
        trendEl.className = 'stats-trend';
    }
}

function renderChart() {
    var chartEl = document.getElementById('statsChart');
    var emptyEl = document.getElementById('statsChartEmpty');
    var data = mockDailyStats.slice(-statsDailyRange);
    if (data.length === 0) {
        chartEl.classList.add('display-none');
        emptyEl.classList.remove('display-none');
        return;
    }
    chartEl.classList.remove('display-none');
    emptyEl.classList.add('display-none');
    var values = data.map(function (d) {
        return statsChartMetric === 'cpm' ? d.avgCpm : Math.round(d.avgAcc * 100);
    });
    var maxVal = Math.max.apply(null, values);
    var minVal = Math.min.apply(null, values);
    var padding = (maxVal - minVal) * 0.1 || 5;
    var yMax = maxVal + padding;
    var yMin = minVal - padding;
    var yRange = yMax - yMin || 1;

    var svgW = chartEl.clientWidth || 600;
    var svgH = 180;
    var padLeft = 48;
    var padRight = 16;
    var padTop = 24;
    var padBottom = 28;
    var chartW = svgW - padLeft - padRight;
    var chartH = svgH - padTop - padBottom;

    var points = data.map(function (d, i) {
        var x = data.length > 1 ? padLeft + (i / (data.length - 1)) * chartW : padLeft + chartW / 2;
        var y = padTop + chartH - ((values[i] - yMin) / yRange) * chartH;
        return {x: x, y: y};
    });

    var linePoints = points.map(function (p) { return p.x + ',' + p.y; }).join(' ');
    var areaPoints = padLeft + ',' + (padTop + chartH) + ' ' + linePoints + ' ' + points[points.length - 1].x + ',' + (padTop + chartH);

    var gridLines = '';
    var gridCount = 4;
    for (var g = 0; g <= gridCount; g++) {
        var gy = padTop + (g / gridCount) * chartH;
        var gVal = Math.round(yMax - (g / gridCount) * yRange);
        var displayGVal = statsChartMetric === 'cpm' ? gVal : gVal + '%';
        gridLines += '<line x1="' + padLeft + '" y1="' + gy + '" x2="' + (svgW - padRight) + '" y2="' + gy + '" class="stats-chart-grid"/>';
        gridLines += '<text x="' + (padLeft - 8) + '" y="' + (gy + 4) + '" class="stats-chart-grid-label">' + displayGVal + '</text>';
    }

    var dotsAndLabels = '';
    for (var i = 0; i < points.length; i++) {
        var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var dateParts = data[i].date.split('-');
        var dateLabel = monthNames[parseInt(dateParts[1]) - 1] + ' ' + parseInt(dateParts[2]);

        // 데이터가 많을 때 날짜 라벨을 간격을 두고 표시
        var labelInterval = data.length > 14 ? Math.ceil(data.length / 6) : 1;
        var showDateLabel = (i % labelInterval === 0) || (i === data.length - 1);

        // 첫/마지막 라벨 정렬 조정 (잘림 방지)
        var textAnchor = 'middle';
        if (showDateLabel && i === 0) textAnchor = 'start';
        else if (showDateLabel && i === data.length - 1) textAnchor = 'end';

        var displayVal = statsChartMetric === 'cpm' ? values[i] : values[i] + '%';
        dotsAndLabels += '<circle cx="' + points[i].x + '" cy="' + points[i].y + '" r="4" class="stats-chart-dot"/>';
        dotsAndLabels += '<g class="stats-chart-tooltip-group" style="opacity:0">'
            + '<rect x="' + (points[i].x - 28) + '" y="' + (points[i].y - 32) + '" width="56" height="24" rx="4" class="stats-chart-tooltip-bg"/>'
            + '<text x="' + points[i].x + '" y="' + (points[i].y - 16) + '" class="stats-chart-point-label">' + displayVal + '</text>'
            + '</g>';
        dotsAndLabels += '<circle cx="' + points[i].x + '" cy="' + points[i].y + '" r="16" class="stats-chart-hover-area" data-index="' + i + '" style="fill:transparent;cursor:pointer"/>';
        if (showDateLabel) {
            dotsAndLabels += '<text x="' + points[i].x + '" y="' + (padTop + chartH + 16) + '" class="stats-chart-date-label" text-anchor="' + textAnchor + '">' + dateLabel + '</text>';
        }
    }

    chartEl.innerHTML = '<svg width="100%" height="' + svgH + '" viewBox="0 0 ' + svgW + ' ' + svgH + '">'
        + gridLines
        + '<polygon points="' + areaPoints + '" class="stats-chart-area"/>'
        + '<polyline points="' + linePoints + '" class="stats-chart-line"/>'
        + dotsAndLabels
        + '</svg>';

    // hover + 팝업 이벤트
    chartEl.querySelectorAll('.stats-chart-hover-area').forEach(function(area) {
        var idx = area.getAttribute('data-index');
        var tooltipGroup = chartEl.querySelectorAll('.stats-chart-tooltip-group')[idx];
        var dot = chartEl.querySelectorAll('.stats-chart-dot')[idx];
        area.addEventListener('mouseenter', function() {
            tooltipGroup.style.opacity = '1';
            dot.setAttribute('r', '6');
            showDailyPopup(data[idx], points[idx]);
        });
        area.addEventListener('mouseleave', function() {
            tooltipGroup.style.opacity = '0';
            dot.setAttribute('r', '4');
            hideDailyPopup();
        });
    });
}

function renderTypoList() {
    var listEl = document.getElementById('statsTypoList');
    var emptyEl = document.getElementById('statsTypoEmpty');
    if (mockTypoStats.length === 0) {
        listEl.classList.add('display-none');
        emptyEl.classList.remove('display-none');
        return;
    }
    listEl.classList.remove('display-none');
    emptyEl.classList.add('display-none');
    var maxCount = mockTypoStats[0].count;
    listEl.innerHTML = mockTypoStats.map(function (item) {
        var widthPercent = (item.count / maxCount) * 100;
        var selectedClass = statsSelectedTypo === item.expected ? 'selected' : '';
        return '<div class="stats-typo-item ' + selectedClass + '" data-expected="' + item.expected + '"><span class="stats-typo-char">' + item.expected + '</span><div class="stats-typo-bar-container"><div class="stats-typo-bar-fill" style="width:' + widthPercent + '%;"></div></div><span class="stats-typo-count">' + item.count + '</span></div>';
    }).join('');
}

function renderTypoDetail(expected) {
    var sectionEl = document.getElementById('statsTypoDetailSection');
    document.getElementById('statsTypoDetailChar').textContent = expected;
    var details = mockTypoDetail[expected];
    if (!details || details.length === 0) {
        sectionEl.classList.add('display-none');
        return;
    }
    sectionEl.classList.remove('display-none');
    document.getElementById('statsTypoDetailList').innerHTML = details.map(function (d) {
        return '<div class="stats-typo-detail-item"><span class="stats-typo-detail-expected">' + d.expected + '</span><span class="stats-typo-detail-arrow">\u2192</span><span class="stats-typo-detail-actual">' + d.actual + '</span><span class="stats-typo-detail-count">' + d.typoCount + '\uD68C</span></div>';
    }).join('');
}

// Events
document.getElementById('navStats').addEventListener('click', function () {
    openStatsPage();
});
document.getElementById('statsBackBtn').addEventListener('click', closeStatsPage);
document.getElementById('statsRefreshBtn').addEventListener('click', function () {
    renderStats();
});

// 일별 상세 팝업
function showDailyPopup(dayData, point) {
    var overlay = document.getElementById('statsDailyPopupOverlay');
    var parts = dayData.date.split('-');
    var title = parts[0] + '년 ' + parseInt(parts[1]) + '월 ' + parseInt(parts[2]) + '일';
    document.getElementById('statsDailyPopupTitle').textContent = title;
    document.getElementById('dailyPopupAttempts').textContent = dayData.attempts + '회';
    document.getElementById('dailyPopupAvgCpm').textContent = Math.round(dayData.avgCpm) + ' CPM';
    document.getElementById('dailyPopupBestCpm').textContent = dayData.bestCpm + ' CPM';
    document.getElementById('dailyPopupAcc').textContent = Math.round(dayData.avgAcc * 100) + '%';

    var pMin = dayData.practiceTimeMin || 0;
    var ph = Math.floor(pMin / 60);
    var pm = Math.round(pMin % 60);
    document.getElementById('dailyPopupTime').textContent = ph > 0 ? ph + '시간 ' + pm + '분' : pm + '분';

    var avgReset = dayData.attempts > 0 ? (dayData.resetCount || 0) / dayData.attempts : 0;
    document.getElementById('dailyPopupReset').textContent = avgReset.toFixed(2) + '회';

    // SVG 좌표를 section 기준 픽셀로 변환
    var chartEl = document.getElementById('statsChart');
    var svg = chartEl.querySelector('svg');
    var svgRect = svg.getBoundingClientRect();
    var sectionRect = overlay.parentElement.getBoundingClientRect();
    var viewBox = svg.viewBox.baseVal;
    var scaleX = svgRect.width / viewBox.width;
    var scaleY = svgRect.height / viewBox.height;

    var pixelX = svgRect.left - sectionRect.left + point.x * scaleX;
    var pixelY = svgRect.top - sectionRect.top + point.y * scaleY;

    overlay.style.left = pixelX + 'px';
    overlay.style.top = (pixelY + 16) + 'px';
    overlay.classList.add('visible');
}

function hideDailyPopup() {
    document.getElementById('statsDailyPopupOverlay').classList.remove('visible');
}

document.querySelectorAll('.stats-tab[data-metric]').forEach(function (tab) {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.stats-tab[data-metric]').forEach(function (t) {
            t.classList.remove('active');
        });
        tab.classList.add('active');
        statsChartMetric = tab.dataset.metric;
        renderChart();
    });
});
document.querySelectorAll('.stats-tab[data-range]').forEach(function (tab) {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.stats-tab[data-range]').forEach(function (t) {
            t.classList.remove('active');
        });
        tab.classList.add('active');
        statsDailyRange = parseInt(tab.dataset.range);
        renderChart();
    });
});
document.getElementById('statsTypoList').addEventListener('click', function (e) {
    var item = e.target.closest('.stats-typo-item');
    if (!item) return;
    var expected = item.dataset.expected;
    if (statsSelectedTypo === expected) {
        statsSelectedTypo = null;
        document.getElementById('statsTypoDetailSection').classList.add('display-none');
    } else {
        statsSelectedTypo = expected;
        renderTypoDetail(expected);
    }
    renderTypoList();
});
// Language & Theme Management
const translations = {
    pl: {
        'TRADING DASHBOARD': 'DASHBOARD TRADINGU',
        '7 Days of Trading': '7 dni tradingu',
        'Total P&L': 'Łączny PnL',
        'Total Trades': 'Liczba transakcji',
        'Win Rate': 'Win Rate',
        'Average Win': 'Średni zysk',
        'Average Loss': 'Średnia strata',
        'Best Trade': 'Najlepsza transakcja',
        'Worst Trade': 'Najgorsza transakcja',
        'Max Drawdown': 'Max Drawdown',
        'Equity Curve': 'Krzywa kapitału',
        'Daily Performance': 'Wyniki dzień po dniu',
        'Performance by Instrument': 'Podział per instrument',
        'All': 'Wszystko',
        'All Trades': 'Wszystkie transakcje',
        'Date': 'Data',
        'Time': 'Czas',
        'Instrument': 'Instrument',
        'Side': 'Strona',
        'Entry': 'Wejście',
        'Exit': 'Wyjście',
        'Quantity': 'Ilość'
    }
};

let currentLang = localStorage.getItem('lang') || 'pl';
let currentTheme = localStorage.getItem('theme') || 'dark';

// Format number with Polish formatting
function formatNumber(num, decimals = 2) {
    if (num === null || num === undefined || typeof num !== 'number' || isNaN(num) || !isFinite(num)) return '0,00';
    return num.toFixed(decimals)
        .replace('.', ',')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Format date in Polish
function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '—';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}`;
}

function formatDateFull(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '—';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Calculate KPIs
function calculateKPIs(trades) {
    const pnlValues = trades.map(t => t.pnl || 0);
    const totalPnl = pnlValues.reduce((sum, val) => sum + val, 0);
    const wins = pnlValues.filter(p => p > 0);
    const losses = pnlValues.filter(p => p < 0);

    const winRate = trades.length > 0 ? (wins.length / trades.length * 100) : 0;
    const avgWin = wins.length > 0 ? wins.reduce((sum, val) => sum + val, 0) / wins.length : 0;
    const avgLoss = losses.length > 0 ? losses.reduce((sum, val) => sum + val, 0) / losses.length : 0;
    const bestTrade = pnlValues.length > 0 ? Math.max(...pnlValues) : 0;
    const worstTrade = pnlValues.length > 0 ? Math.min(...pnlValues) : 0;

    // Calculate max drawdown
    let peak = 0;
    let maxDrawdown = 0;
    let cumulative = 0;

    for (const pnl of pnlValues) {
        cumulative += pnl;
        if (cumulative > peak) {
            peak = cumulative;
        }
        const drawdown = peak - cumulative;
        if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
        }
    }

    return {
        totalPnl,
        totalTrades: trades.length,
        winRate,
        avgWin,
        avgLoss,
        bestTrade,
        worstTrade,
        maxDrawdown: -maxDrawdown
    };
}

// Update KPI Display
function updateKPIs(kpis) {
    document.getElementById('totalPnl').textContent = '$' + formatNumber(kpis.totalPnl);
    document.getElementById('totalTrades').textContent = kpis.totalTrades;
    document.getElementById('winRate').textContent = formatNumber(kpis.winRate, 1) + '%';
    document.getElementById('avgWin').textContent = '$' + formatNumber(kpis.avgWin);
    document.getElementById('avgLoss').textContent = '$' + formatNumber(kpis.avgLoss);
    document.getElementById('bestTrade').textContent = '$' + formatNumber(kpis.bestTrade);
    document.getElementById('worstTrade').textContent = '$' + formatNumber(kpis.worstTrade);
    document.getElementById('maxDrawdown').textContent = '$' + formatNumber(kpis.maxDrawdown);
}

// Initialize Charts
let equityChart, dailyChart, instrumentChart;

function initEquityChart() {
    const ctx = document.getElementById('equityChart').getContext('2d');

    // Calculate cumulative equity
    let cumulative = 0;
    const equityData = tradingData.trades.map(trade => {
        cumulative += (trade.pnl || 0);
        return cumulative;
    });

    const labels = tradingData.trades.map((_, i) => i + 1);

    if (equityChart) equityChart.destroy();

    equityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Kapitał',
                data: equityData,
                borderColor: '#8b7cf6',
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) return null;
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(139, 124, 246, 0.3)');
                    gradient.addColorStop(1, 'rgba(139, 124, 246, 0)');
                    return gradient;
                },
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#8b7cf6',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(10, 11, 17, 0.9)',
                    titleColor: '#a0a0b8',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(139, 124, 246, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: (context) => '$' + formatNumber(context.parsed.y)
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(139, 124, 246, 0.05)' },
                    ticks: { color: '#6b6b82' }
                },
                y: {
                    grid: { color: 'rgba(139, 124, 246, 0.05)' },
                    ticks: {
                        color: '#6b6b82',
                        callback: (value) => formatNumber(value)
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function initDailyChart() {
    const ctx = document.getElementById('dailyChart').getContext('2d');

    const labels = tradingData.dailySummary.map(d => formatDate(d.date));
    const data = tradingData.dailySummary.map(d => d.pnl);

    if (dailyChart) dailyChart.destroy();

    dailyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'P&L',
                data: data,
                backgroundColor: data.map(val => val >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)'),
                borderColor: data.map(val => val >= 0 ? '#10b981' : '#ef4444'),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(10, 11, 17, 0.9)',
                    titleColor: '#a0a0b8',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(139, 124, 246, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: (context) => '$' + formatNumber(context.parsed.y)
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#6b6b82' }
                },
                y: {
                    grid: { color: 'rgba(139, 124, 246, 0.05)' },
                    ticks: {
                        color: '#6b6b82',
                        callback: (value) => formatNumber(value)
                    }
                }
            }
        }
    });
}

function initInstrumentChart() {
    const ctx = document.getElementById('instrumentChart').getContext('2d');

    // Group by instrument
    const instrumentPnL = {};
    tradingData.trades.forEach(trade => {
        if (!instrumentPnL[trade.instrument]) {
            instrumentPnL[trade.instrument] = 0;
        }
        instrumentPnL[trade.instrument] += (trade.pnl || 0);
    });

    const labels = Object.keys(instrumentPnL);
    const data = Object.values(instrumentPnL);

    if (instrumentChart) instrumentChart.destroy();

    instrumentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'P&L',
                data: data,
                backgroundColor: data.map(val => val >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)'),
                borderColor: data.map(val => val >= 0 ? '#10b981' : '#ef4444'),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(10, 11, 17, 0.9)',
                    titleColor: '#a0a0b8',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(139, 124, 246, 0.3)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: (context) => '$' + formatNumber(context.parsed.y)
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#6b6b82' }
                },
                y: {
                    grid: { color: 'rgba(139, 124, 246, 0.05)' },
                    ticks: {
                        color: '#6b6b82',
                        callback: (value) => formatNumber(value)
                    }
                }
            }
        }
    });
}

// Populate Trades Table
let currentSort = { column: 'id', ascending: true };
let currentFilter = 'all';

function populateTable(trades) {
    const tbody = document.getElementById('tradesTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    trades.forEach(trade => {
        const row = document.createElement('tr');
        const pnl = trade.pnl || 0;
        const pnlClass = pnl >= 0 ? 'positive' : 'negative';

        // Create cells safely without innerHTML to prevent XSS
        const cells = [
            trade.id,
            formatDateFull(trade.date),
            trade.time,
            trade.instrument,
            trade.side,
            formatNumber(trade.entry),
            formatNumber(trade.exit),
            formatNumber(trade.quantity, 2),
            '$' + formatNumber(pnl)
        ];

        cells.forEach((content, index) => {
            const td = document.createElement('td');
            if (index === 3) td.innerHTML = '<strong></strong>';
            if (index === 3) td.querySelector('strong').textContent = content;
            else if (index === 8) {
                td.className = pnlClass;
                td.textContent = content;
            } else {
                td.textContent = content;
            }
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });
}

function sortTable(column) {
    if (currentSort.column === column) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.column = column;
        currentSort.ascending = true;
    }

    const sorted = [...tradingData.trades].sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];

        if (column === 'pnl') {
            aVal = aVal || 0;
            bVal = bVal || 0;
        }

        // Handle null/undefined values
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return currentSort.ascending ?
                aVal.localeCompare(bVal) :
                bVal.localeCompare(aVal);
        }

        return currentSort.ascending ? aVal - bVal : bVal - aVal;
    });

    populateTable(filterTrades(sorted));
}

function filterTrades(trades) {
    if (currentFilter === 'all') return trades;

    // Check if it's a date filter (YYYY-MM-DD format only)
    if (/^\d{4}-\d{2}-\d{2}$/.test(currentFilter)) {
        return trades.filter(t => t.date === currentFilter);
    }

    // Otherwise it's an instrument filter
    return trades.filter(t => t.instrument === currentFilter);
}

function applyFilter(filter, targetElement) {
    currentFilter = filter;

    // Update pill active state
    document.querySelectorAll('.pill').forEach(pill => {
        pill.classList.remove('active');
    });
    if (targetElement) {
        targetElement.classList.add('active');
    }

    // Filter and display
    const filtered = filterTrades(tradingData.trades);
    populateTable(filtered);

    // Update KPIs for filtered data
    const kpis = calculateKPIs(filtered);
    updateKPIs(kpis);
}

// Language Toggle
function toggleLanguage() {
    currentLang = currentLang === 'pl' ? 'en' : 'pl';
    localStorage.setItem('lang', currentLang);

    if (currentLang === 'en') {
        document.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = el.getAttribute('data-en');
        });
    } else {
        document.querySelectorAll('[data-en]').forEach(el => {
            const enText = el.getAttribute('data-en');
            el.textContent = translations.pl[enText] || enText;
        });
    }
}

// Theme Toggle
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);

    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }

    // Reinitialize charts with new theme colors only if data is loaded
    if (typeof tradingData !== 'undefined' && tradingData && tradingData.trades && tradingData.dailySummary) {
        initEquityChart();
        initDailyChart();
        initInstrumentChart();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    // Check if data is loaded
    if (typeof tradingData === 'undefined' || !tradingData || !tradingData.trades || !tradingData.dailySummary) {
        console.error('Trading data not loaded. Make sure data.js is included before app.js');
        document.body.innerHTML = '<div style="color: white; text-align: center; padding: 50px;">Error: Trading data not loaded</div>';
        return;
    }

    // Calculate and display KPIs
    const kpis = calculateKPIs(tradingData.trades);
    updateKPIs(kpis);

    // Initialize charts
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded. Check CDN connection.');
        return;
    }
    initEquityChart();
    initDailyChart();
    initInstrumentChart();

    // Populate table
    populateTable(tradingData.trades);

    // Language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Table sorting
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            sortTable(th.getAttribute('data-sort'));
        });
    });

    // Filter pills
    document.querySelectorAll('.pill[data-filter]').forEach(pill => {
        pill.addEventListener('click', (e) => {
            const filter = pill.getAttribute('data-filter');
            applyFilter(filter, e.currentTarget);
        });
    });

    // Apply language on load
    if (currentLang === 'en') {
        document.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = el.getAttribute('data-en');
        });
    }
});

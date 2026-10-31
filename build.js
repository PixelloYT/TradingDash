const fs = require('fs');
const path = require('path');

// Helper function to parse CSV
function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    data.push(row);
  }

  return data;
}

// Helper function to check if date is in range (23-29.10.2026)
function isInDateRange(dateStr) {
  const date = new Date(dateStr);
  const startDate = new Date('2026-10-23');
  const endDate = new Date('2026-10-29');
  return date >= startDate && date <= endDate;
}

// Main build function
function build() {
  const wynikiDir = path.join(__dirname, 'wyniki');

  // Read and combine all trades files
  const tradesFiles = [
    'trades_1_23-24.csv',
    'trades_2_25-26.csv',
    'trades_3_27-29.csv'
  ];

  let allTrades = [];

  tradesFiles.forEach(filename => {
    const filePath = path.join(wynikiDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    const trades = parseCSV(content);
    allTrades = allTrades.concat(trades);
  });

  // Filter trades to date range
  const filteredTrades = allTrades.filter(trade => isInDateRange(trade.data));

  // Convert numeric fields and map to English field names for app.js
  const trades = filteredTrades.map(trade => ({
    id: parseInt(trade.nr),
    date: trade.data,
    time: '00:00', // CSV doesn't have time, use placeholder
    instrument: trade.token,
    side: trade.side,
    entry: 0, // CSV doesn't have entry/exit prices
    exit: 0,
    quantity: parseFloat(trade.stawka_usd) / 100, // approximate
    pnl: parseFloat(trade.wynik_usd) || 0
  }));

  // Read daily summary
  const summaryPath = path.join(wynikiDir, 'dni_podsumowanie.csv');
  const summaryContent = fs.readFileSync(summaryPath, 'utf-8');
  const summaryData = parseCSV(summaryContent);

  // Filter summary to date range
  const filteredSummary = summaryData.filter(day => isInDateRange(day.data));

  // Convert numeric fields in summary and map to English field names
  const dailySummary = filteredSummary.map(day => ({
    date: day.data,
    dailyPnl: day.wynik_dnia_usd ? parseFloat(day.wynik_dnia_usd) : 0,
    portfolioValue: day.portfel_usd ? parseFloat(day.portfel_usd) : 0,
    returnPercent: day.zwrot_proc ? parseFloat(day.zwrot_proc) : 0,
    tradeCount: day.liczba_transakcji_licznik ? parseInt(day.liczba_transakcji_licznik) : 0
  }));

  // Generate data.js content
  const dataJS = `const tradingData = {
  trades: ${JSON.stringify(trades, null, 2)},
  dailySummary: ${JSON.stringify(dailySummary, null, 2)}
};
`;

  // Write data.js
  const outputPath = path.join(__dirname, 'data.js');
  fs.writeFileSync(outputPath, dataJS, 'utf-8');

  console.log(`✓ Wygenerowano data.js`);
  console.log(`  - Liczba transakcji: ${trades.length}`);
  console.log(`  - Liczba dni w podsumowaniu: ${dailySummary.length}`);
  console.log(`  - Zakres dat: 23-29.10.2026`);
}

// Run build
try {
  build();
} catch (error) {
  console.error('Błąd podczas budowania:', error.message);
  process.exit(1);
}

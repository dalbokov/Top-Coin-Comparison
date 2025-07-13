// ============================
// APPLICATION STATE
// ============================

const AppState = {
    currentMethod: 'market-cap',
    currentPeriod: 30,
    currentCoins: 10,
    customCoins: [],
    chartData: [],
    chartInstance: null,
    selectedCoins: []
};

// Required by Chart.js wrapper in chart.js
const ChartJS = window.Chart;

// ============================
// INIT APP
// ============================

document.addEventListener('DOMContentLoaded', async () => {
    Controls.init();
    CoinPickerModal.init();
    Chart.init();

    console.log('✅ App initialized with real data.');
});

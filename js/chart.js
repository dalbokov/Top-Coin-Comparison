// ============================
// CHART MODULE
// ============================

const Chart = {
    init() {
        this.createChart();
        this.updateData();
    },

    createChart() {
        const ctx = document.getElementById('priceChart').getContext('2d');

        AppState.chartInstance = new ChartJS(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                const value = context.parsed.y;
                                const percentage = ((value - 100) / 100 * 100).toFixed(1);
                                return `${context.dataset.label}: ${percentage}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Price Change (%)'
                        },
                        ticks: {
                            callback: function (value) {
                                return ((value - 100) / 100 * 100).toFixed(0) + '%';
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                elements: {
                    point: {
                        radius: 0,
                        hoverRadius: 5
                    },
                    line: {
                        tension: 0.2
                    }
                }
            }
        });
    },

    async updateData() {
        const chart = AppState.chartInstance;
        if (!chart) return;

        const days = AppState.currentPeriod;
        let coinList = [];

        try {
            if (AppState.currentMethod === 'custom') {
                coinList = AppState.customCoins;
            } else if (AppState.currentMethod === 'category') {
                const category = document.getElementById('category').value;
                coinList = await CoinGeckoAPI.getCoinsByCategory(category);
            } else {
                const limit = AppState.currentCoins;
                coinList = await CoinGeckoAPI.getTopCoins(limit);
            }

            AppState.chartData = coinList;
            const labels = generateDateLabels(days);

            const datasets = await Promise.all(coinList.map(async coin => {
                const prices = await CoinGeckoAPI.getHistoricalPrices(coin.id, days);
                const color = coin.color || getRandomColor();
                return {
                    label: coin.symbol.toUpperCase(),
                    data: prices.map(p => p.price),
                    borderColor: color,
                    backgroundColor: color + '20',
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 4
                };
            }));

            chart.data.labels = labels;
            chart.data.datasets = datasets;
            chart.update();

            this.updateLegend();

        } catch (err) {
            console.error('Error updating chart:', err);
        }
    },

    updateLegend() {
        const legendContainer = document.getElementById('coin-legend');
        legendContainer.innerHTML = '';

        if (!AppState.chartData || AppState.chartData.length === 0) return;

        AppState.chartData.forEach(async (coin) => {
            try {
                const prices = await CoinGeckoAPI.getHistoricalPrices(coin.id, AppState.currentPeriod);
                const first = prices[0].price;
                const last = prices[prices.length - 1].price;
                const performance = ((last - first) / first * 100).toFixed(1);
                const isPositive = performance >= 0;

                const color = coin.color || getRandomColor();
                const item = document.createElement('div');
                item.className = 'coin-item';
                item.innerHTML = `
                    <div class="coin-color" style="background: ${color};"></div>
                    <span>${coin.symbol.toUpperCase()}</span>
                    <span class="coin-performance ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '+' : ''}${performance}%
                    </span>
                `;
                legendContainer.appendChild(item);
            } catch (e) {
                console.warn(`Failed to update legend for ${coin.id}`);
            }
        });
    }
};

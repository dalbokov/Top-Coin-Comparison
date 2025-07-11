// ============================
// UTILITY FUNCTIONS
// ============================

function getRandomColor() {
    const colors = [
        '#27ae60', '#3498db', '#f39c12', '#e67e22',
        '#e74c3c', '#9b59b6', '#1abc9c', '#34495e',
        '#16a085', '#8e44ad', '#2ecc71', '#c0392b'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ============================
// COINGECKO API MODULE
// ============================

const CoinGeckoAPI = {
    BASE_URL: 'https://api.coingecko.com/api/v3',

    async getCoinsForMethod(method) {
        const count = AppState.currentCoins;
        if (AppState.selectedCoins.length > 0) {
            return AppState.selectedCoins.slice(0, count);
        }

        if (method === 'market-cap') {
            return await this.getTopCoins(count);
        } else if (method === 'category') {
            const selectedCategory = document.getElementById('category').value;
            return await this.getCoinsByCategory(selectedCategory, count);
        }

        return [];
    },

    async getTopCoins(limit = 10) {
        const res = await fetch(`${this.BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1`);
        const coins = await res.json();
        return coins.map(coin => ({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            color: getRandomColor()
        }));
    },

    async getCoinsByCategory(category, limit = 10) {
        const res = await fetch(`${this.BASE_URL}/coins/markets?vs_currency=usd&category=${category}&order=market_cap_desc&per_page=${limit}&page=1`);
        const coins = await res.json();
        return coins.map(coin => ({
            id: coin.id,
            symbol: coin.symbol,
            name: coin.name,
            color: getRandomColor()
        }));
    },

    async getHistoricalPrices(coinId, days) {
        const res = await fetch(`${this.BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`);
        const data = await res.json();
        return data.prices.map(p => ({
            date: new Date(p[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: p[1]
        }));
    }
};

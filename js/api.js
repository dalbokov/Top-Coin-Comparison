// ============================
// COINGECKO API WRAPPER
// ============================

const CoinGeckoAPI = {
    base: 'https://api.coingecko.com/api/v3',

    async getTopCoins(limit = 100) {
        try {
            const url = `${this.base}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch top coins');
            return await res.json();
        } catch (e) {
            console.error('getTopCoins:', e);
            return [];
        }
    },

    async getCategoryCoins(category = 'layer-1') {
        try {
            const url = `${this.base}/coins/markets?vs_currency=usd&category=${encodeURIComponent(category)}&order=market_cap_desc&per_page=50&page=1&sparkline=false`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch category coins');
            return await res.json();
        } catch (e) {
            console.error('getCategoryCoins:', e);
            return [];
        }
    },

    async getHistoricalPrices(id, days = 30) {
        try {
            const url = `${this.base}/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to fetch price history for ${id}`);
            const data = await res.json();
            return data.prices.map(entry => ({
                timestamp: entry[0],
                price: entry[1]
            }));
        } catch (e) {
            console.error('getHistoricalPrices:', e);
            return [];
        }
    }
};

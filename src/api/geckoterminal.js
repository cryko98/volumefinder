import axios from 'axios';
const API_BASE = 'https://api.geckoterminal.com/api/v2/networks/solana';
const client = axios.create({
    timeout: 10000,
    headers: { 'Accept': 'application/json' },
});
const retryRequest = async (fn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        }
        catch (error) {
            if (i === maxRetries - 1)
                throw error;
            await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
        }
    }
    throw new Error('Max retries exceeded');
};
export const getPoolOHLCV = async (poolAddress, timeframe = '5m', limit = 100) => {
    return retryRequest(async () => {
        const response = await client.get(`${API_BASE}/pools/${poolAddress}/ohlcv/${timeframe}`, { params: { limit } });
        if (!response.data?.data?.ohlcv)
            return [];
        return response.data.data.ohlcv.map((candle) => ({
            timestamp: new Date(candle[0]).getTime(),
            open: parseFloat(candle[1]) || 0,
            high: parseFloat(candle[2]) || 0,
            low: parseFloat(candle[3]) || 0,
            close: parseFloat(candle[4]) || 0,
            volume: parseFloat(candle[5]) || 0,
        }));
    }).catch(error => {
        console.warn('GeckoTerminal API error:', error.message);
        return [];
    });
};
export const getPoolInfo = async (poolAddress) => {
    return retryRequest(async () => {
        const response = await client.get(`${API_BASE}/pools/${poolAddress}`);
        if (!response.data?.data)
            return null;
        const pool = response.data.data;
        return {
            address: pool.id || poolAddress,
            name: pool.attributes?.name || '',
            baseTokenAddress: pool.relationships?.base_token?.data?.id || '',
            quoteTokenAddress: pool.relationships?.quote_token?.data?.id || '',
            liquidity: parseFloat(pool.attributes?.reserve_in_usd) || 0,
            volume24h: parseFloat(pool.attributes?.volume_usd?.h24) || 0,
        };
    }).catch(error => {
        console.warn('GeckoTerminal API error:', error.message);
        return null;
    });
};

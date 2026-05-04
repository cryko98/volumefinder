import axios from 'axios';
const API_BASE = 'https://public-api.birdeye.so/defi';
const client = axios.create({
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'X-API-KEY': import.meta.env.VITE_BIRDEYE_API_KEY || '',
    },
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
export const getTokenTransactions = async (tokenAddress, limit = 100) => {
    if (!import.meta.env.VITE_BIRDEYE_API_KEY) {
        console.warn('Birdeye API key not configured');
        return [];
    }
    return retryRequest(async () => {
        const response = await client.get(`${API_BASE}/txs/token`, {
            params: {
                address: tokenAddress,
                limit,
            },
        });
        if (!response.data?.data?.items)
            return [];
        return response.data.data.items.map((tx) => ({
            txHash: tx.txHash || '',
            timestamp: tx.blockTime || 0,
            amount: parseFloat(tx.tokenAmount) || 0,
            amountUsd: parseFloat(tx.valueUsd) || 0,
            buyer: tx.fromToken?.mint || '',
            seller: tx.toToken?.mint || '',
            isBuy: tx.txType === 'buy',
        }));
    }).catch(error => {
        console.warn('Birdeye API error:', error.message);
        return [];
    });
};
export const getUniqueBuyerCount = async (tokenAddress, timeWindowMs = 15 * 60 * 1000) => {
    const transactions = await getTokenTransactions(tokenAddress, 1000);
    const now = Date.now();
    const cutoff = now - timeWindowMs;
    const uniqueBuyers = new Set();
    transactions
        .filter(tx => tx.isBuy && tx.timestamp * 1000 >= cutoff)
        .forEach(tx => uniqueBuyers.add(tx.buyer));
    return uniqueBuyers.size;
};
export const calculateBuySellRatio = async (tokenAddress, timeWindowMs = 5 * 60 * 1000) => {
    const transactions = await getTokenTransactions(tokenAddress, 500);
    const now = Date.now();
    const cutoff = now - timeWindowMs;
    const filtered = transactions.filter(tx => tx.timestamp * 1000 >= cutoff);
    const buys = filtered.filter(tx => tx.isBuy).length;
    const sells = filtered.filter(tx => !tx.isBuy).length;
    if (buys + sells === 0)
        return 0;
    return buys / (buys + sells);
};

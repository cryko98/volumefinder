import axios from 'axios';
const API_BASE = 'https://api.dexscreener.com/latest/dex';
const client = axios.create({
    timeout: 10000,
    headers: { 'Accept': 'application/json' },
});
// Add retry logic
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
export const getTrendingTokens = async () => {
    return retryRequest(async () => {
        const response = await client.get(`${API_BASE}/tokens/solana`, {
            params: {
                order: 'volume_m5',
                chainId: 'solana',
                limit: 50,
            },
        });
        if (!response.data?.pairs)
            return [];
        return response.data.pairs
            .filter((pair) => ['raydium', 'pumpswap', 'meteora'].includes(pair.dexId?.toLowerCase()) &&
            (pair.marketCap?.usd || 0) >= 40000)
            .map((pair) => parsePair(pair));
    });
};
export const getTokenByAddress = async (address) => {
    return retryRequest(async () => {
        const response = await client.get(`${API_BASE}/tokens/solana/${address}`);
        if (!response.data?.pairs?.[0])
            return null;
        return parsePair(response.data.pairs[0]);
    });
};
export const getTokensByAddresses = async (addresses) => {
    if (addresses.length === 0)
        return [];
    return retryRequest(async () => {
        const response = await client.get(`${API_BASE}/tokens/solana/${addresses.join(',')}`);
        if (!response.data?.pairs)
            return [];
        return response.data.pairs
            .filter((pair) => ['raydium', 'pumpswap', 'meteora'].includes(pair.dexId?.toLowerCase()))
            .map((pair) => parsePair(pair));
    });
};
const parsePair = (pair) => ({
    pairAddress: pair.pairAddress || '',
    chainId: pair.chainId || 'solana',
    dexId: pair.dexId || '',
    baseToken: {
        address: pair.baseToken?.address || '',
        symbol: pair.baseToken?.symbol || 'UNKNOWN',
        name: pair.baseToken?.name || '',
        decimals: pair.baseToken?.decimals || 6,
        logo: pair.baseToken?.image,
    },
    quoteToken: {
        address: pair.quoteToken?.address || '',
        symbol: pair.quoteToken?.symbol || 'USDC',
        name: pair.quoteToken?.name || '',
        decimals: pair.quoteToken?.decimals || 6,
        logo: pair.quoteToken?.image,
    },
    priceUsd: parseFloat(pair.priceUsd) || 0,
    priceChange: {
        m5: parseFloat(pair.priceChange?.m5) || 0,
        m15: parseFloat(pair.priceChange?.m15) || 0,
        m30: parseFloat(pair.priceChange?.m30) || 0,
        h1: parseFloat(pair.priceChange?.h1) || 0,
        h24: parseFloat(pair.priceChange?.h24) || 0,
    },
    volume: {
        m5: parseFloat(pair.volume?.m5) || 0,
        h1: parseFloat(pair.volume?.h1) || 0,
        h24: parseFloat(pair.volume?.h24) || 0,
    },
    liquidity: {
        usd: parseFloat(pair.liquidity?.usd) || 0,
        base: parseFloat(pair.liquidity?.base) || 0,
        quote: parseFloat(pair.liquidity?.quote) || 0,
    },
    txns: pair.txns ? {
        m5: pair.txns.m5 ? { buys: pair.txns.m5.buys || 0, sells: pair.txns.m5.sells || 0 } : undefined,
        h1: pair.txns.h1 ? { buys: pair.txns.h1.buys || 0, sells: pair.txns.h1.sells || 0 } : undefined,
        h24: pair.txns.h24 ? { buys: pair.txns.h24.buys || 0, sells: pair.txns.h24.sells || 0 } : undefined,
    } : undefined,
    marketCap: parseFloat(pair.marketCap?.usd) || 0,
    fdv: parseFloat(pair.fdv?.usd) || 0,
});

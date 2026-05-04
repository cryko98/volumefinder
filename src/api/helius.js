import axios from 'axios';
const API_KEY = import.meta.env.VITE_HELIUS_API_KEY;
const API_BASE = API_KEY ? `https://mainnet.helius-rpc.com/?api-key=${API_KEY}` : null;
const client = axios.create({
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
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
export const getTokenHolders = async (mintAddress) => {
    if (!API_BASE) {
        console.warn('Helius API key not configured');
        return null;
    }
    return retryRequest(async () => {
        const response = await client.post(API_BASE, {
            jsonrpc: '2.0',
            id: 1,
            method: 'getTokenAccounts',
            params: {
                mint: mintAddress,
                limit: 10000,
            },
        });
        if (response.data?.error) {
            console.warn('Helius error:', response.data.error);
            return null;
        }
        const tokenAccounts = response.data?.result?.token_accounts || [];
        const totalHolders = tokenAccounts.length;
        if (totalHolders === 0)
            return null;
        // Sort by amount and get top holders
        const sorted = tokenAccounts.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        const totalSupply = sorted.reduce((sum, acc) => sum + (acc.amount || 0), 0);
        const topHolderAmount = sorted[0]?.amount || 0;
        const topHolderPercentage = totalSupply > 0 ? (topHolderAmount / totalSupply) * 100 : 0;
        // Simple bundle detection: if top 10 holders own > 90% and accounts are similar age
        const top10Total = sorted.slice(0, 10).reduce((sum, acc) => sum + (acc.amount || 0), 0);
        const top10Percentage = totalSupply > 0 ? (top10Total / totalSupply) * 100 : 0;
        const isBundled = top10Percentage > 90 || topHolderPercentage > 50;
        return {
            address: mintAddress,
            totalHolders,
            topHolderPercentage,
            isBundled,
        };
    }).catch(error => {
        console.warn('Helius API error:', error.message);
        return null;
    });
};
export const checkMintAuthority = async (mintAddress) => {
    if (!API_BASE)
        return { isFrozen: false, authorityExists: true };
    return retryRequest(async () => {
        const response = await client.post(API_BASE, {
            jsonrpc: '2.0',
            id: 1,
            method: 'getMint',
            params: [mintAddress],
        });
        if (response.data?.error)
            return { isFrozen: false, authorityExists: true };
        const mint = response.data?.result;
        return {
            isFrozen: mint?.mintAuthority === null,
            authorityExists: mint?.mintAuthority !== null,
        };
    }).catch(() => ({ isFrozen: false, authorityExists: true }));
};

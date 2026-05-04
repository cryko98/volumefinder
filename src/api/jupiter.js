import axios from 'axios';
const API_BASE = 'https://price.jup.ag/v6';
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
export const getTokenPrice = async (address) => {
    return retryRequest(async () => {
        const response = await client.get(`${API_BASE}/price`, {
            params: { ids: address },
        });
        if (!response.data?.data?.[address])
            return null;
        return {
            address,
            priceUsd: parseFloat(response.data.data[address].price) || 0,
            timestamp: Date.now(),
        };
    }).catch(error => {
        console.warn('Jupiter API error:', error.message);
        return null;
    });
};
export const getTokenPrices = async (addresses) => {
    if (addresses.length === 0)
        return [];
    return retryRequest(async () => {
        const response = await client.get(`${API_BASE}/price`, {
            params: { ids: addresses.join(',') },
        });
        if (!response.data?.data)
            return [];
        return Object.entries(response.data.data).map(([address, data]) => ({
            address,
            priceUsd: parseFloat(data.price) || 0,
            timestamp: Date.now(),
        }));
    }).catch(error => {
        console.warn('Jupiter API error:', error.message);
        return [];
    });
};

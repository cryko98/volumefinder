import { TokenCache } from './cache';
import { TokenAnalyzer } from './analyzer';
import { TokenFilter } from './filters';
import { getTrendingTokens } from '../api/dexscreener';
export class TokenScanner {
    constructor(scanIntervalMs = 30000) {
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "analyzer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isRunning", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "scanIntervalMs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lastScanTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.cache = new TokenCache();
        this.analyzer = new TokenAnalyzer(this.cache);
        this.scanIntervalMs = scanIntervalMs;
    }
    async scan(filterConfig) {
        const startTime = Date.now();
        try {
            // 1. Fetch trending tokens from DexScreener
            const tokens = await getTrendingTokens();
            if (tokens.length === 0) {
                return {
                    tokens: [],
                    timestamp: startTime,
                    totalScanned: 0,
                };
            }
            // 2. Update cache with new data
            tokens.forEach(token => this.cache.set(token.baseToken.address, token));
            // 3. Score each token
            const scoredTokens = [];
            for (const token of tokens) {
                const score = await this.analyzer.scoreToken(token);
                if (score) {
                    scoredTokens.push(score);
                }
            }
            // 4. Apply filters
            const filtered = TokenFilter.applyFilters(scoredTokens, filterConfig);
            // 5. Sort by score descending
            const sorted = filtered.sort((a, b) => b.score - a.score);
            this.lastScanTime = Date.now();
            return {
                tokens: sorted,
                timestamp: startTime,
                totalScanned: tokens.length,
            };
        }
        catch (error) {
            console.error('Scan error:', error);
            return {
                tokens: [],
                timestamp: startTime,
                totalScanned: 0,
            };
        }
    }
    startContinuous(filterConfig, onScanComplete, onError) {
        if (this.isRunning) {
            console.warn('Scanner already running');
            return () => { };
        }
        this.isRunning = true;
        let intervalId;
        const runScan = async () => {
            try {
                const result = await this.scan(filterConfig);
                onScanComplete(result);
            }
            catch (error) {
                onError(error instanceof Error ? error : new Error(String(error)));
            }
        };
        // Run immediately, then at interval
        runScan();
        intervalId = setInterval(runScan, this.scanIntervalMs);
        // Return stop function
        return () => {
            this.isRunning = false;
            clearInterval(intervalId);
        };
    }
    stop() {
        this.isRunning = false;
    }
    isActive() {
        return this.isRunning;
    }
    getLastScanTime() {
        return this.lastScanTime;
    }
    getCache() {
        return this.cache;
    }
    setScanInterval(ms) {
        this.scanIntervalMs = ms;
    }
}

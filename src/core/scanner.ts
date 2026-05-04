import { TokenCache } from './cache';
import { TokenAnalyzer } from './analyzer';
import { TokenFilter } from './filters';
import { getTrendingTokens } from '../api/dexscreener';
import { TokenScore, ScanResult, FilterConfig } from '../types/index';

export class TokenScanner {
  private cache: TokenCache;
  private analyzer: TokenAnalyzer;
  private isRunning = false;
  private scanIntervalMs: number;
  private lastScanTime = 0;

  constructor(scanIntervalMs = 30000) {
    this.cache = new TokenCache();
    this.analyzer = new TokenAnalyzer(this.cache);
    this.scanIntervalMs = scanIntervalMs;
  }

  async scan(filterConfig: FilterConfig): Promise<ScanResult> {
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
      const scoredTokens: TokenScore[] = [];
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
    } catch (error) {
      console.error('Scan error:', error);
      return {
        tokens: [],
        timestamp: startTime,
        totalScanned: 0,
      };
    }
  }

  startContinuous(
    filterConfig: FilterConfig,
    onScanComplete: (result: ScanResult) => void,
    onError: (error: Error) => void
  ): () => void {
    if (this.isRunning) {
      console.warn('Scanner already running');
      return () => {};
    }

    this.isRunning = true;
    let intervalId: NodeJS.Timeout;

    const runScan = async () => {
      try {
        const result = await this.scan(filterConfig);
        onScanComplete(result);
      } catch (error) {
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

  stop(): void {
    this.isRunning = false;
  }

  isActive(): boolean {
    return this.isRunning;
  }

  getLastScanTime(): number {
    return this.lastScanTime;
  }

  getCache(): TokenCache {
    return this.cache;
  }

  setScanInterval(ms: number): void {
    this.scanIntervalMs = ms;
  }
}

import { TokenPair, TokenScore, FilterConfig } from '../types/index';

export class TokenFilter {
  static applyFilters(tokens: TokenScore[], config: FilterConfig): TokenScore[] {
    return tokens.filter(token => {
      const pair = token.token;

      // Market cap filter
      if ((pair.marketCap || 0) < config.minMarketCap) return false;
      if ((pair.marketCap || 0) > config.maxMarketCap) return false;

      // Volume spike filter
      if (token.volumeSpike < config.minVolumeSpike) return false;

      // Liquidity filter
      if (pair.liquidity.usd < config.minLiquidity) return false;

      // Score filter
      if (token.score < config.minScore) return false;

      // Buyer count filter
      if (token.buyerCount < config.minBuyerCount) return false;

      // DEX filter
      if (config.dexes.length > 0) {
        if (!config.dexes.includes(pair.dexId.toLowerCase())) return false;
      }

      return true;
    });
  }

  static getDefaultConfig(): FilterConfig {
    return {
      minMarketCap: 40000,
      maxMarketCap: 10000000,
      minVolumeSpike: 3,
      minLiquidity: 20000,
      minScore: 70,
      minBuyerCount: 50,
      timeWindow: '5m',
      dexes: ['raydium', 'pumpswap', 'meteora'],
    };
  }
}

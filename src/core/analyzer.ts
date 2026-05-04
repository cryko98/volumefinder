import { TokenPair, TokenScore } from '../types/index';
import { TokenCache } from './cache';
import { getUniqueBuyerCount, calculateBuySellRatio } from '../api/birdeye';

interface ScoringWeights {
  volumeSpike: number; // 40%
  momentum: number; // 30%
  buyerCount: number; // 20%
  liquidity: number; // 10%
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  volumeSpike: 0.4,
  momentum: 0.3,
  buyerCount: 0.2,
  liquidity: 0.1,
};

export class TokenAnalyzer {
  private cache: TokenCache;
  private weights: ScoringWeights;

  constructor(cache: TokenCache, weights: Partial<ScoringWeights> = {}) {
    this.cache = cache;
    this.weights = { ...DEFAULT_WEIGHTS, ...weights };
  }

  async scoreToken(token: TokenPair): Promise<TokenScore | null> {
    try {
      const volumeSpike = this.calculateVolumeSpike(token);
      const momentum = this.calculateMomentum(token);
      const buyerCount = await this.getBuyerCount(token);
      const liquidity = this.calculateLiquidity(token);

      // All criteria must be met
      if (!this.meetsAllCriteria(volumeSpike, momentum, buyerCount, liquidity, token)) {
        return null;
      }

      const score = this.calculateFinalScore(volumeSpike, momentum, buyerCount, liquidity);

      return {
        token,
        score,
        volumeSpike,
        momentum,
        buyerCount,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.warn(`Error scoring token ${token.baseToken.symbol}:`, error);
      return null;
    }
  }

  private calculateVolumeSpike(token: TokenPair): number {
    const currentVolume = token.volume.m5;
    const avgVolume = this.cache.getAverageVolume(token.baseToken.address, 60 * 60 * 1000);

    if (avgVolume === 0) return 0;
    const spike = currentVolume / avgVolume;
    // Cap at 10x for scoring purposes
    return Math.min(spike, 10);
  }

  private calculateMomentum(token: TokenPair): number {
    // Normalize price changes to 0-100 scale
    const m5Change = token.priceChange.m5;
    const m15Change = token.priceChange.m15;

    // Both 5m and 15m must be positive
    if (m5Change <= 0 || m15Change <= 0) return 0;

    const avgChange = (m5Change + m15Change) / 2;
    // Cap at 100% for scoring
    return Math.min(avgChange, 100);
  }

  private async getBuyerCount(token: TokenPair): Promise<number> {
    try {
      // Note: In production, use Birdeye API with proper API key
      // For now, estimate from transaction count
      const estimatedBuyers = Math.round((token.txns?.m5?.buys || 0) * 0.7);
      return Math.max(estimatedBuyers, 0);
    } catch (error) {
      return 0;
    }
  }

  private calculateLiquidity(token: TokenPair): number {
    // Normalize liquidity to 0-100 scale (max useful liquidity is $500k for scoring)
    const maxLiquidity = 500000;
    const liquidityScore = Math.min((token.liquidity.usd / maxLiquidity) * 100, 100);
    return liquidityScore;
  }

  private meetsAllCriteria(
    volumeSpike: number,
    momentum: number,
    buyerCount: number,
    liquidity: number,
    token: TokenPair
  ): boolean {
    // Lazított kritériumok - nagyobb catch
    return (
      // 1. Market cap >= $5k (volt $40k)
      (token.marketCap || 0) >= 5000 &&
      // 2. Volume spike >= 1.5x (volt 3x)
      volumeSpike >= 1.5 &&
      // 3. Positive momentum on 5m OR 15m (volt AND)
      (momentum > 0 || token.priceChange.m5 > 0) &&
      // 4. Liquidity >= $5k (volt $20k)
      liquidity >= 5000
    );
  }

  private getBuySellRatio(token: TokenPair): number {
    if (!token.txns?.m5) return 1.0;
    const { buys, sells } = token.txns.m5;
    const total = buys + sells;
    if (total === 0) return 1.0;
    return buys / total;
  }

  private calculateFinalScore(
    volumeSpike: number,
    momentum: number,
    buyerCount: number,
    liquidity: number
  ): number {
    // Normalize metrics to 0-100
    const volumeSpikeScore = Math.min((volumeSpike / 10) * 100, 100);
    const momentumScore = momentum; // Already 0-100
    const buyerScore = Math.min((buyerCount / 500) * 100, 100); // 500 buyers = max score
    const liquidityScore = liquidity; // Already 0-100

    // Apply weights
    const finalScore =
      volumeSpikeScore * this.weights.volumeSpike +
      momentumScore * this.weights.momentum +
      buyerScore * this.weights.buyerCount +
      liquidityScore * this.weights.liquidity;

    return Math.round(Math.min(finalScore, 100));
  }
}

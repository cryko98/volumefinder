import { TokenPair, VolumeSnapshot } from '../types/index';

export class TokenCache {
  private cache: Map<string, { token: TokenPair; snapshots: VolumeSnapshot[] }> =
    new Map();
  private readonly maxAge = 60 * 60 * 1000; // 60 minutes

  set(address: string, token: TokenPair): void {
    const existing = this.cache.get(address);
    const snapshot: VolumeSnapshot = {
      timestamp: Date.now(),
      m5Volume: token.volume.m5,
      m15Volume: token.volume.h1, // Using h1 as proxy for 15m since DexScreener doesn't provide 15m
      m30Volume: token.volume.h1,
      h1Volume: token.volume.h1,
    };

    if (existing) {
      existing.token = token;
      existing.snapshots.push(snapshot);
      // Keep only last 60 minutes
      const cutoff = Date.now() - this.maxAge;
      existing.snapshots = existing.snapshots.filter(s => s.timestamp >= cutoff);
    } else {
      this.cache.set(address, {
        token,
        snapshots: [snapshot],
      });
    }
  }

  get(address: string): TokenPair | null {
    const entry = this.cache.get(address);
    if (!entry) return null;

    // Check if data is stale
    if (Date.now() - entry.token.priceUsd > this.maxAge) {
      this.cache.delete(address);
      return null;
    }

    return entry.token;
  }

  getSnapshots(address: string): VolumeSnapshot[] {
    const entry = this.cache.get(address);
    if (!entry) return [];

    // Filter to last 60 minutes
    const cutoff = Date.now() - this.maxAge;
    return entry.snapshots.filter(s => s.timestamp >= cutoff);
  }

  getAverageVolume(address: string, windowMs: number): number {
    const snapshots = this.getSnapshots(address);
    if (snapshots.length === 0) return 0;

    const cutoff = Date.now() - windowMs;
    const relevant = snapshots.filter(s => s.timestamp >= cutoff);

    if (relevant.length === 0) return 0;

    const total = relevant.reduce((sum, s) => sum + s.m5Volume, 0);
    return total / relevant.length;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  getAllTokens(): TokenPair[] {
    return Array.from(this.cache.values()).map(e => e.token);
  }
}

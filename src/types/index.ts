export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
}

export interface PriceChange {
  m5: number;
  m15: number;
  m30: number;
  h1: number;
  h24: number;
}

export interface Volume {
  m5: number;
  h1: number;
  h24: number;
}

export interface Liquidity {
  usd: number;
  base: number;
  quote: number;
}

export interface TokenPair {
  pairAddress: string;
  chainId: string;
  dexId: string;
  baseToken: Token;
  quoteToken: Token;
  priceUsd: number;
  priceChange: PriceChange;
  volume: Volume;
  liquidity: Liquidity;
  txns?: {
    m5?: { buys: number; sells: number };
    h1?: { buys: number; sells: number };
    h24?: { buys: number; sells: number };
  };
  marketCap?: number;
  fdv?: number;
}

export interface VolumeSnapshot {
  timestamp: number;
  m5Volume: number;
  m15Volume: number;
  m30Volume: number;
  h1Volume: number;
}

export interface TokenScore {
  token: TokenPair;
  score: number;
  volumeSpike: number;
  momentum: number;
  buyerCount: number;
  timestamp: number;
}

export interface ScanResult {
  tokens: TokenScore[];
  timestamp: number;
  totalScanned: number;
}

export interface Alert {
  id: string;
  tokenAddress: string;
  symbol: string;
  score: number;
  timestamp: number;
  action: 'created' | 'updated' | 'removed';
}

export interface FilterConfig {
  minMarketCap: number;
  maxMarketCap: number;
  minVolumeSpike: number;
  minLiquidity: number;
  minScore: number;
  minBuyerCount: number;
  timeWindow: '5m' | '15m';
  dexes: string[];
}

export interface ScannerState {
  isRunning: boolean;
  lastScanTime: number;
  tokens: TokenScore[];
  alerts: Alert[];
  filters: FilterConfig;
  isHealthy: boolean;
}

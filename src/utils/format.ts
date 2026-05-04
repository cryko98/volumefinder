export function formatNumber(num: number, decimals = 2): string {
  if (num === 0) return '0';

  const absNum = Math.abs(num);

  if (absNum >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals) + 'M';
  }
  if (absNum >= 1_000) {
    return (num / 1_000).toFixed(decimals) + 'K';
  }
  if (absNum < 0.01 && absNum !== 0) {
    return num.toExponential(2);
  }

  return num.toFixed(decimals);
}

export function formatPrice(price: number): string {
  if (price === 0) return '$0';
  if (price < 0.0001) return '$' + price.toExponential(2);
  if (price < 1) return '$' + price.toFixed(6);
  return '$' + price.toFixed(2);
}

export function formatVolume(volume: number): string {
  return '$' + formatNumber(volume);
}

export function formatMarketCap(marketCap: number): string {
  return '$' + formatNumber(marketCap, 0);
}

export function formatPercent(percent: number, decimals = 2): string {
  const sign = percent >= 0 ? '+' : '';
  return sign + percent.toFixed(decimals) + '%';
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - timestamp;

  if (diff < 1000) return 'now';
  if (diff < 60000) return Math.floor(diff / 1000) + 's ago';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';

  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

export function formatAddress(address: string, chars = 6): string {
  if (address.length <= chars * 2) return address;
  return address.slice(0, chars) + '...' + address.slice(-chars);
}

export function formatScoreColor(score: number): string {
  if (score >= 90) return 'text-red-500';
  if (score >= 80) return 'text-orange-500';
  if (score >= 70) return 'text-yellow-500';
  return 'text-gray-500';
}

export function formatScoreBg(score: number): string {
  if (score >= 90) return 'bg-red-500/20';
  if (score >= 80) return 'bg-orange-500/20';
  if (score >= 70) return 'bg-yellow-500/20';
  return 'bg-gray-500/20';
}

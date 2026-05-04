import { useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { TokenScore } from '../types/index';
import { formatPrice, formatVolume, formatPercent, formatAddress, formatScoreColor, formatScoreBg } from '../utils/format';
import { copyToClipboard } from '../utils/notifications';

interface TokenCardProps {
  token: TokenScore;
  onDetailsClick?: () => void;
}

export function TokenCard({ token, onDetailsClick }: TokenCardProps) {
  const [copied, setCopied] = useState(false);
  const pair = token.token;

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(pair.baseToken.address);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const dexscreenerUrl = `https://dexscreener.com/solana/${pair.pairAddress}`;
  const birdeyeUrl = `https://birdeye.so/token/${pair.baseToken.address}`;
  const photonUrl = `https://photon-sol.tinyastro.io/en/lp/${pair.pairAddress}`;
  const bullxUrl = `https://www.bullx.io/?tokenAddress=${pair.baseToken.address}`;
  const axiomUrl = `https://app.axiom.co/trade?mint=${pair.baseToken.address}`;

  return (
    <div
      onClick={onDetailsClick}
      className="bg-solana-card border border-gray-700 rounded-lg p-4 hover:border-solana-green/50 hover:shadow-lg hover:shadow-solana-green/20 transition cursor-pointer group"
    >
      {/* Header with score badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          {pair.baseToken.logo && (
            <img
              src={pair.baseToken.logo}
              alt={pair.baseToken.symbol}
              className="w-8 h-8 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <div>
            <div className="font-bold text-gray-100">{pair.baseToken.symbol}</div>
            <div className="text-xs text-gray-500">{pair.baseToken.name.slice(0, 20)}</div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded font-bold text-sm ${formatScoreBg(token.score)} ${formatScoreColor(token.score)}`}>
          {token.score}
        </div>
      </div>

      {/* Contract Address (critical) */}
      <div className="mb-3 p-2 bg-gray-900/50 rounded font-mono text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-400 truncate">{formatAddress(pair.baseToken.address, 8)}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyAddress();
            }}
            className="flex-shrink-0 p-1 hover:bg-solana-green/20 rounded transition"
            title="Copy contract address"
          >
            {copied ? (
              <Check size={14} className="text-solana-green" />
            ) : (
              <Copy size={14} className="text-gray-500 hover:text-solana-green" />
            )}
          </button>
        </div>
      </div>

      {/* Price & Changes */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div>
          <div className="text-gray-500 text-xs">Price</div>
          <div className="text-gray-100 font-mono">{formatPrice(pair.priceUsd)}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">24h</div>
          <div className={pair.priceChange.h24 >= 0 ? 'text-green-400' : 'text-red-400'}>
            {formatPercent(pair.priceChange.h24)}
          </div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">5m</div>
          <div className={pair.priceChange.m5 >= 0 ? 'text-green-400' : 'text-red-400'}>
            {formatPercent(pair.priceChange.m5)}
          </div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">15m</div>
          <div className={pair.priceChange.m15 >= 0 ? 'text-green-400' : 'text-red-400'}>
            {formatPercent(pair.priceChange.m15)}
          </div>
        </div>
      </div>

      {/* Volume & Liquidity */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div>
          <div className="text-gray-500 text-xs">Volume (5m)</div>
          <div className="text-gray-100 font-mono text-xs">{formatVolume(pair.volume.m5)}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Liquidity</div>
          <div className="text-gray-100 font-mono text-xs">{formatVolume(pair.liquidity.usd)}</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Volume Spike</div>
          <div className="text-solana-green font-mono text-xs">{token.volumeSpike.toFixed(1)}x</div>
        </div>
        <div>
          <div className="text-gray-500 text-xs">Market Cap</div>
          <div className="text-gray-100 font-mono text-xs">${(pair.marketCap || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            openLink(dexscreenerUrl);
          }}
          className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-800 hover:bg-solana-purple/30 text-gray-300 rounded transition"
        >
          DexScreener
          <ExternalLink size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openLink(birdeyeUrl);
          }}
          className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-800 hover:bg-solana-purple/30 text-gray-300 rounded transition"
        >
          Birdeye
          <ExternalLink size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openLink(photonUrl);
          }}
          className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-800 hover:bg-solana-purple/30 text-gray-300 rounded transition"
        >
          Photon
          <ExternalLink size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openLink(bullxUrl);
          }}
          className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-800 hover:bg-solana-purple/30 text-gray-300 rounded transition"
        >
          BullX
          <ExternalLink size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openLink(axiomUrl);
          }}
          className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-800 hover:bg-solana-purple/30 text-gray-300 rounded transition"
        >
          Axiom
          <ExternalLink size={12} />
        </button>
      </div>

      {/* View Chart Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDetailsClick?.();
        }}
        className="w-full py-2 bg-solana-green/20 hover:bg-solana-green/30 text-solana-green rounded font-semibold text-sm transition"
      >
        View Chart
      </button>
    </div>
  );
}

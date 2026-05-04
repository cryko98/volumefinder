import { X } from 'lucide-react';
import { TokenPair } from '../types/index';

interface ChartEmbedProps {
  pair: TokenPair;
  onClose: () => void;
}

export function ChartEmbed({ pair, onClose }: ChartEmbedProps) {
  const embedUrl = `https://dexscreener.com/solana/${pair.pairAddress}?embed=1&theme=dark&trades=0&info=0`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-solana-card border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-gray-100">
            {pair.baseToken.symbol}/{pair.quoteToken.symbol}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded transition"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Chart iframe */}
        <div className="flex-1 overflow-hidden">
          <iframe
            src={embedUrl}
            className="w-full h-full border-none"
            title={`${pair.baseToken.symbol} Chart`}
            sandbox="allow-same-origin allow-scripts allow-popups"
          />
        </div>
      </div>
    </div>
  );
}

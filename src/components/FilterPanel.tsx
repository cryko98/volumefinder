import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatNumber } from '../utils/format';

export function FilterPanel() {
  const { filters, setFilters } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleMinMarketCap = (value: number) => {
    setFilters({ minMarketCap: value });
  };

  const handleMinVolumeSpike = (value: number) => {
    setFilters({ minVolumeSpike: value });
  };

  const handleMinScore = (value: number) => {
    setFilters({ minScore: value });
  };

  const handleMinLiquidity = (value: number) => {
    setFilters({ minLiquidity: value });
  };

  const toggleDex = (dex: string) => {
    setFilters({
      dexes: filters.dexes.includes(dex)
        ? filters.dexes.filter(d => d !== dex)
        : [...filters.dexes, dex],
    });
  };

  return (
    <div className="bg-solana-card rounded border border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition"
      >
        <h3 className="font-semibold text-gray-200">Filters</h3>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-gray-700 px-4 py-4 space-y-4">
          {/* Min Market Cap */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Min Market Cap: <span className="text-solana-green">${formatNumber(filters.minMarketCap, 0)}</span>
            </label>
            <input
              type="range"
              min="40000"
              max="10000000"
              step="10000"
              value={filters.minMarketCap}
              onChange={(e) => handleMinMarketCap(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Volume Spike */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Min Volume Spike: <span className="text-solana-green">{filters.minVolumeSpike.toFixed(1)}x</span>
            </label>
            <input
              type="range"
              min="2"
              max="10"
              step="0.5"
              value={filters.minVolumeSpike}
              onChange={(e) => handleMinVolumeSpike(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Min Liquidity */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Min Liquidity: <span className="text-solana-green">${formatNumber(filters.minLiquidity, 0)}</span>
            </label>
            <input
              type="range"
              min="10000"
              max="500000"
              step="10000"
              value={filters.minLiquidity}
              onChange={(e) => handleMinLiquidity(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Min Score */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Min Score: <span className="text-solana-green">{filters.minScore}</span>
            </label>
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={filters.minScore}
              onChange={(e) => handleMinScore(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* DEX Selection */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">DEX</label>
            <div className="space-y-2">
              {['raydium', 'pumpswap', 'meteora'].map((dex) => (
                <label key={dex} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.dexes.includes(dex)}
                    onChange={() => toggleDex(dex)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-300 capitalize">{dex}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

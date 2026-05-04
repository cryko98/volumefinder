import { Play, Pause, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatTime } from '../utils/format';

interface HeaderProps {
  onSettingsClick: () => void;
  onStartClick: () => void;
  onStopClick: () => void;
}

export function Header({ onSettingsClick, onStartClick, onStopClick }: HeaderProps) {
  const { isRunning, lastScanTime, isHealthy } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-solana-dark border-b border-solana-card">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-solana-green">📊 Volume Sniper</div>
          <div className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-solana-green' : 'bg-red-500'}`} />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            {lastScanTime > 0 && (
              <div>
                Last scan: <span className="text-gray-300">{formatTime(lastScanTime)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {isRunning ? (
              <button
                onClick={onStopClick}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
              >
                <Pause size={18} />
                <span className="hidden sm:inline">Stop</span>
              </button>
            ) : (
              <button
                onClick={onStartClick}
                className="flex items-center gap-2 px-4 py-2 bg-solana-green/20 text-solana-green rounded hover:bg-solana-green/30 transition"
              >
                <Play size={18} />
                <span className="hidden sm:inline">Start</span>
              </button>
            )}

            <button
              onClick={onSettingsClick}
              className="flex items-center gap-2 px-4 py-2 bg-solana-purple/20 text-solana-purple rounded hover:bg-solana-purple/30 transition"
            >
              <Settings size={18} />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

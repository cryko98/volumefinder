import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { TokenPair } from './types';
import { useStore } from './store/useStore';
import { useScanner } from './hooks/useScanner';
import { useNotifications } from './hooks/useNotifications';
import { requestNotificationPermission } from './utils/notifications';
import { Header } from './components/Header';
import { FilterPanel } from './components/FilterPanel';
import { TokenCard } from './components/TokenCard';
import { ChartEmbed } from './components/ChartEmbed';
import { AlertsPanel } from './components/AlertsPanel';
import { Toast } from './components/ui/Toast';

export function App() {
  const { tokens, filters } = useStore();
  const { start, stop } = useScanner();
  const [selectedToken, setSelectedToken] = useState<TokenPair | null>(null);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [enableSound, setEnableSound] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Initialize notifications hook
  useNotifications({
    enableBrowser: enableNotifications,
    enableSound: enableSound,
    minScore: 90,
  });

  // Request notification permission on mount
  useEffect(() => {
    const initNotifications = async () => {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        setEnableNotifications(true);
      }
    };

    initNotifications();
  }, []);

  const handleStart = () => {
    start();
    setToast({ message: 'Scanner started', type: 'success' });
  };

  const handleStop = () => {
    stop();
    setToast({ message: 'Scanner stopped', type: 'info' });
  };

  return (
    <div className="min-h-screen bg-solana-dark text-gray-100">
      <Header
        onStartClick={handleStart}
        onStopClick={handleStop}
        onSettingsClick={() => setShowSettings(!showSettings)}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <FilterPanel />

            {/* Alerts Button */}
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="w-full flex items-center gap-2 px-4 py-3 bg-solana-purple/20 hover:bg-solana-purple/30 text-solana-purple rounded transition font-semibold"
            >
              <Bell size={18} />
              <span>Alerts</span>
            </button>

            {/* Settings Panel */}
            {showSettings && (
              <div className="bg-solana-card border border-gray-700 rounded p-4 space-y-4">
                <h3 className="font-semibold text-gray-200">Notification Settings</h3>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableNotifications}
                    onChange={(e) => setEnableNotifications(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-300">Browser Notifications</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableSound}
                    onChange={(e) => setEnableSound(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-300">Sound Alerts</span>
                </label>

                <p className="text-xs text-gray-500">
                  Alerts trigger when score ≥ 90. Free API tier limits data availability.
                </p>
              </div>
            )}
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3">
            {tokens.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  🔍 Scanning for trending tokens...
                </p>
                <p className="text-gray-600 text-sm">Start the scanner to begin monitoring. Usually finds tokens within 1-2 minutes.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Top Pick */}
                {tokens[0] && (
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-solana-green/50 to-solana-purple/50 rounded-lg blur opacity-75"></div>
                    <div className="relative bg-solana-card border-2 border-solana-green rounded-lg p-4">
                      <div className="text-xs font-bold text-solana-green mb-2">🔥 TOP OPPORTUNITY</div>
                      <TokenCard
                        token={tokens[0]}
                        onDetailsClick={() => setSelectedToken(tokens[0].token)}
                      />
                    </div>
                  </div>
                )}

                {/* Grid */}
                <div>
                  <h3 className="text-lg font-bold text-gray-300 mb-3">All Candidates ({tokens.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tokens.slice(1).map((token) => (
                      <TokenCard
                        key={token.token.pairAddress}
                        token={token}
                        onDetailsClick={() => setSelectedToken(token.token)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedToken && <ChartEmbed pair={selectedToken} onClose={() => setSelectedToken(null)} />}
      {showAlerts && <AlertsPanel onClose={() => setShowAlerts(false)} />}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

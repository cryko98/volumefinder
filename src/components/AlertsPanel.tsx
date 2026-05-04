import { X, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatTime, formatScoreColor } from '../utils/format';

interface AlertsPanelProps {
  onClose: () => void;
}

export function AlertsPanel({ onClose }: AlertsPanelProps) {
  const { alerts, removeAlert, clearAlerts } = useStore();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-solana-card border border-gray-700 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-gray-100">Recent Alerts ({alerts.length})</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded transition">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto space-y-2 p-4">
          {alerts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No alerts yet</div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 bg-gray-900/50 border border-gray-700 rounded flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-gray-100">{alert.symbol}</div>
                  <div className="text-xs text-gray-500">{formatTime(alert.timestamp)}</div>
                  <div className={`text-sm font-bold ${formatScoreColor(alert.score)}`}>
                    Score: {alert.score}
                  </div>
                </div>
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="p-1 hover:bg-red-500/20 rounded transition"
                >
                  <X size={16} className="text-gray-500 hover:text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {alerts.length > 0 && (
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={clearAlerts}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition"
            >
              <Trash2 size={16} />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

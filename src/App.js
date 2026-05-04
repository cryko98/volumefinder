import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
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
    const [selectedToken, setSelectedToken] = useState(null);
    const [showAlerts, setShowAlerts] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [enableNotifications, setEnableNotifications] = useState(false);
    const [enableSound, setEnableSound] = useState(false);
    const [toast, setToast] = useState(null);
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
    return (_jsxs("div", { className: "min-h-screen bg-solana-dark text-gray-100", children: [_jsx(Header, { onStartClick: handleStart, onStopClick: handleStop, onSettingsClick: () => setShowSettings(!showSettings) }), _jsx("main", { className: "max-w-7xl mx-auto px-4 py-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsxs("div", { className: "lg:col-span-1 space-y-4", children: [_jsx(FilterPanel, {}), _jsxs("button", { onClick: () => setShowAlerts(!showAlerts), className: "w-full flex items-center gap-2 px-4 py-3 bg-solana-purple/20 hover:bg-solana-purple/30 text-solana-purple rounded transition font-semibold", children: [_jsx(Bell, { size: 18 }), _jsx("span", { children: "Alerts" })] }), showSettings && (_jsxs("div", { className: "bg-solana-card border border-gray-700 rounded p-4 space-y-4", children: [_jsx("h3", { className: "font-semibold text-gray-200", children: "Notification Settings" }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: enableNotifications, onChange: (e) => setEnableNotifications(e.target.checked), className: "w-4 h-4" }), _jsx("span", { className: "text-sm text-gray-300", children: "Browser Notifications" })] }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: enableSound, onChange: (e) => setEnableSound(e.target.checked), className: "w-4 h-4" }), _jsx("span", { className: "text-sm text-gray-300", children: "Sound Alerts" })] }), _jsx("p", { className: "text-xs text-gray-500", children: "Alerts trigger when score \u2265 90. Free API tier limits data availability." })] }))] }), _jsx("div", { className: "lg:col-span-3", children: tokens.length === 0 ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500 mb-4", children: tokens.length === 0
                                        ? 'No tokens detected yet. Start the scanner to begin.'
                                        : 'Adjust filters to see more tokens.' }) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: tokens.map((token) => (_jsx(TokenCard, { token: token, onDetailsClick: () => setSelectedToken(token.token) }, token.token.pairAddress))) })) })] }) }), selectedToken && _jsx(ChartEmbed, { pair: selectedToken, onClose: () => setSelectedToken(null) }), showAlerts && _jsx(AlertsPanel, { onClose: () => setShowAlerts(false) }), toast && (_jsx(Toast, { message: toast.message, type: toast.type, onClose: () => setToast(null) }))] }));
}

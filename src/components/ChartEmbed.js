import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { X } from 'lucide-react';
export function ChartEmbed({ pair, onClose }) {
    const embedUrl = `https://dexscreener.com/solana/${pair.pairAddress}?embed=1&theme=dark&trades=0&info=0`;
    return (_jsx("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-solana-card border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-700", children: [_jsxs("h2", { className: "text-lg font-bold text-gray-100", children: [pair.baseToken.symbol, "/", pair.quoteToken.symbol] }), _jsx("button", { onClick: onClose, className: "p-1 hover:bg-gray-800 rounded transition", children: _jsx(X, { size: 24, className: "text-gray-400" }) })] }), _jsx("div", { className: "flex-1 overflow-hidden", children: _jsx("iframe", { src: embedUrl, className: "w-full h-full border-none", title: `${pair.baseToken.symbol} Chart`, sandbox: "allow-same-origin allow-scripts allow-popups" }) })] }) }));
}

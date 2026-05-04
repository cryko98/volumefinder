import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { formatPrice, formatVolume, formatPercent, formatAddress, formatScoreColor, formatScoreBg } from '../utils/format';
import { copyToClipboard } from '../utils/notifications';
export function TokenCard({ token, onDetailsClick }) {
    const [copied, setCopied] = useState(false);
    const pair = token.token;
    const handleCopyAddress = async () => {
        const success = await copyToClipboard(pair.baseToken.address);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    const openLink = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };
    const dexscreenerUrl = `https://dexscreener.com/solana/${pair.pairAddress}`;
    const birdeyeUrl = `https://birdeye.so/token/${pair.baseToken.address}`;
    const photonUrl = `https://photon-sol.tinyastro.io/en/lp/${pair.pairAddress}`;
    const bullxUrl = `https://www.bullx.io/?tokenAddress=${pair.baseToken.address}`;
    const axiomUrl = `https://app.axiom.co/trade?mint=${pair.baseToken.address}`;
    return (_jsxs("div", { onClick: onDetailsClick, className: "bg-solana-card border border-gray-700 rounded-lg p-4 hover:border-solana-green/50 hover:shadow-lg hover:shadow-solana-green/20 transition cursor-pointer group", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-3 flex-1", children: [pair.baseToken.logo && (_jsx("img", { src: pair.baseToken.logo, alt: pair.baseToken.symbol, className: "w-8 h-8 rounded-full", onError: (e) => {
                                    e.target.style.display = 'none';
                                } })), _jsxs("div", { children: [_jsx("div", { className: "font-bold text-gray-100", children: pair.baseToken.symbol }), _jsx("div", { className: "text-xs text-gray-500", children: pair.baseToken.name.slice(0, 20) })] })] }), _jsx("div", { className: `px-3 py-1 rounded font-bold text-sm ${formatScoreBg(token.score)} ${formatScoreColor(token.score)}`, children: token.score })] }), _jsx("div", { className: "mb-3 p-2 bg-gray-900/50 rounded font-mono text-xs", children: _jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("span", { className: "text-gray-400 truncate", children: formatAddress(pair.baseToken.address, 8) }), _jsx("button", { onClick: (e) => {
                                e.stopPropagation();
                                handleCopyAddress();
                            }, className: "flex-shrink-0 p-1 hover:bg-solana-green/20 rounded transition", title: "Copy contract address", children: copied ? (_jsx(Check, { size: 14, className: "text-solana-green" })) : (_jsx(Copy, { size: 14, className: "text-gray-500 hover:text-solana-green" })) })] }) }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mb-3 text-sm", children: [_jsxs("div", { children: [_jsx("div", { className: "text-gray-500 text-xs", children: "Price" }), _jsx("div", { className: "text-gray-100 font-mono", children: formatPrice(pair.priceUsd) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-gray-500 text-xs", children: "24h" }), _jsx("div", { className: pair.priceChange.h24 >= 0 ? 'text-green-400' : 'text-red-400', children: formatPercent(pair.priceChange.h24) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-gray-500 text-xs", children: "5m" }), _jsx("div", { className: pair.priceChange.m5 >= 0 ? 'text-green-400' : 'text-red-400', children: formatPercent(pair.priceChange.m5) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-gray-500 text-xs", children: "15m" }), _jsx("div", { className: pair.priceChange.m15 >= 0 ? 'text-green-400' : 'text-red-400', children: formatPercent(pair.priceChange.m15) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mb-3 text-sm", children: [_jsxs("div", { children: [_jsx("div", { className: "text-gray-500 text-xs", children: "Volume (5m)" }), _jsx("div", { className: "text-gray-100 font-mono text-xs", children: formatVolume(pair.volume.m5) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-gray-500 text-xs", children: "Liquidity" }), _jsx("div", { className: "text-gray-100 font-mono text-xs", children: formatVolume(pair.liquidity.usd) })] }), _jsxs("div", { children: [_jsx("div", { className: "text-gray-500 text-xs", children: "Volume Spike" }), _jsxs("div", { className: "text-solana-green font-mono text-xs", children: [token.volumeSpike.toFixed(1), "x"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-gray-500 text-xs", children: "Market Cap" }), _jsxs("div", { className: "text-gray-100 font-mono text-xs", children: ["$", (pair.marketCap || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })] })] })] }), _jsxs("div", { className: "flex flex-wrap gap-2 mb-3", children: [_jsxs("button", { onClick: (e) => {
                            e.stopPropagation();
                            openLink(dexscreenerUrl);
                        }, className: "flex items-center gap-1 text-xs px-2 py-1 bg-gray-800 hover:bg-solana-purple/30 text-gray-300 rounded transition", children: ["DexScreener", _jsx(ExternalLink, { size: 12 })] }), _jsxs("button", { onClick: (e) => {
                            e.stopPropagation();
                            openLink(birdeyeUrl);
                        }, className: "flex items-center gap-1 text-xs px-2 py-1 bg-gray-800 hover:bg-solana-purple/30 text-gray-300 rounded transition", children: ["Birdeye", _jsx(ExternalLink, { size: 12 })] }), _jsxs("button", { onClick: (e) => {
                            e.stopPropagation();
                            openLink(photonUrl);
                        }, className: "flex items-center gap-1 text-xs px-2 py-1 bg-gray-800 hover:bg-solana-purple/30 text-gray-300 rounded transition", children: ["Photon", _jsx(ExternalLink, { size: 12 })] }), _jsxs("button", { onClick: (e) => {
                            e.stopPropagation();
                            openLink(bullxUrl);
                        }, className: "flex items-center gap-1 text-xs px-2 py-1 bg-gray-800 hover:bg-solana-purple/30 text-gray-300 rounded transition", children: ["BullX", _jsx(ExternalLink, { size: 12 })] }), _jsxs("button", { onClick: (e) => {
                            e.stopPropagation();
                            openLink(axiomUrl);
                        }, className: "flex items-center gap-1 text-xs px-2 py-1 bg-gray-800 hover:bg-solana-purple/30 text-gray-300 rounded transition", children: ["Axiom", _jsx(ExternalLink, { size: 12 })] })] }), _jsx("button", { onClick: (e) => {
                    e.stopPropagation();
                    onDetailsClick?.();
                }, className: "w-full py-2 bg-solana-green/20 hover:bg-solana-green/30 text-solana-green rounded font-semibold text-sm transition", children: "View Chart" })] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatNumber } from '../utils/format';
export function FilterPanel() {
    const { filters, setFilters } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const handleMinMarketCap = (value) => {
        setFilters({ minMarketCap: value });
    };
    const handleMinVolumeSpike = (value) => {
        setFilters({ minVolumeSpike: value });
    };
    const handleMinScore = (value) => {
        setFilters({ minScore: value });
    };
    const handleMinLiquidity = (value) => {
        setFilters({ minLiquidity: value });
    };
    const toggleDex = (dex) => {
        setFilters({
            dexes: filters.dexes.includes(dex)
                ? filters.dexes.filter(d => d !== dex)
                : [...filters.dexes, dex],
        });
    };
    return (_jsxs("div", { className: "bg-solana-card rounded border border-gray-700", children: [_jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition", children: [_jsx("h3", { className: "font-semibold text-gray-200", children: "Filters" }), _jsx(ChevronDown, { size: 18, className: `text-gray-400 transition ${isOpen ? 'rotate-180' : ''}` })] }), isOpen && (_jsxs("div", { className: "border-t border-gray-700 px-4 py-4 space-y-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm text-gray-300 mb-2", children: ["Min Market Cap: ", _jsxs("span", { className: "text-solana-green", children: ["$", formatNumber(filters.minMarketCap, 0)] })] }), _jsx("input", { type: "range", min: "40000", max: "10000000", step: "10000", value: filters.minMarketCap, onChange: (e) => handleMinMarketCap(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm text-gray-300 mb-2", children: ["Min Volume Spike: ", _jsxs("span", { className: "text-solana-green", children: [filters.minVolumeSpike.toFixed(1), "x"] })] }), _jsx("input", { type: "range", min: "2", max: "10", step: "0.5", value: filters.minVolumeSpike, onChange: (e) => handleMinVolumeSpike(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm text-gray-300 mb-2", children: ["Min Liquidity: ", _jsxs("span", { className: "text-solana-green", children: ["$", formatNumber(filters.minLiquidity, 0)] })] }), _jsx("input", { type: "range", min: "10000", max: "500000", step: "10000", value: filters.minLiquidity, onChange: (e) => handleMinLiquidity(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm text-gray-300 mb-2", children: ["Min Score: ", _jsx("span", { className: "text-solana-green", children: filters.minScore })] }), _jsx("input", { type: "range", min: "50", max: "95", step: "1", value: filters.minScore, onChange: (e) => handleMinScore(Number(e.target.value)), className: "w-full" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm text-gray-300 mb-2", children: "DEX" }), _jsx("div", { className: "space-y-2", children: ['raydium', 'pumpswap', 'meteora'].map((dex) => (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: filters.dexes.includes(dex), onChange: () => toggleDex(dex), className: "w-4 h-4" }), _jsx("span", { className: "text-sm text-gray-300 capitalize", children: dex })] }, dex))) })] })] }))] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
export function Toast({ message, duration = 3000, type = 'info', onClose }) {
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);
    if (!isVisible)
        return null;
    const bgColor = {
        success: 'bg-green-500/20 border-green-500/50',
        error: 'bg-red-500/20 border-red-500/50',
        info: 'bg-blue-500/20 border-blue-500/50',
    }[type];
    const textColor = {
        success: 'text-green-400',
        error: 'text-red-400',
        info: 'text-blue-400',
    }[type];
    return (_jsxs("div", { className: `fixed bottom-4 right-4 px-4 py-3 rounded border ${bgColor} ${textColor} flex items-center gap-3 z-50 animate-fade-in`, children: [_jsx("span", { children: message }), _jsx("button", { onClick: () => setIsVisible(false), className: "hover:opacity-70", children: _jsx(X, { size: 16 }) })] }));
}

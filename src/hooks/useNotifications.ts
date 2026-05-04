import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { sendNotification, playSound } from '../utils/notifications';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface NotificationSettings {
  enableBrowser: boolean;
  enableSound: boolean;
  minScore: number;
}

export function useNotifications(settings: NotificationSettings) {
  const { tokens, addAlert } = useStore();
  const seenTokensRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    tokens.forEach((token) => {
      const key = `${token.token.baseToken.address}-${token.score}`;

      if (!seenTokensRef.current.has(key) && token.score >= settings.minScore) {
        seenTokensRef.current.add(key);

        // Send notification
        if (settings.enableBrowser) {
          const message = `${token.token.baseToken.symbol} • Score: ${token.score}`;
          sendNotification('🚀 Volume Spike Detected!', {
            body: message,
            tag: token.token.baseToken.address,
          });
        }

        if (settings.enableSound) {
          playSound('alert');
        }

        // Add to alerts
        addAlert({
          id: generateId(),
          tokenAddress: token.token.baseToken.address,
          symbol: token.token.baseToken.symbol,
          score: token.score,
          timestamp: Date.now(),
          action: 'created',
        });
      }
    });
  }, [tokens, settings.enableBrowser, settings.enableSound, settings.minScore, addAlert]);
}

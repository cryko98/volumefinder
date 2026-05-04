import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { TokenScanner } from '../core/scanner';

export function useScanner() {
  const { setTokens, setRunning, setLastScanTime, filters } = useStore();
  const scannerRef = useRef<TokenScanner | null>(null);
  const stopFnRef = useRef<(() => void) | null>(null);

  const start = () => {
    if (!scannerRef.current) {
      scannerRef.current = new TokenScanner(
        parseInt(import.meta.env.VITE_SCAN_INTERVAL_MS || '30000')
      );
    }

    if (stopFnRef.current) return; // Already running

    setRunning(true);

    stopFnRef.current = scannerRef.current.startContinuous(
      filters,
      (result) => {
        setTokens(result.tokens);
        setLastScanTime(result.timestamp);
      },
      (error) => {
        console.error('Scanner error:', error);
        setRunning(false);
      }
    );
  };

  const stop = () => {
    if (stopFnRef.current) {
      stopFnRef.current();
      stopFnRef.current = null;
    }
    if (scannerRef.current) {
      scannerRef.current.stop();
    }
    setRunning(false);
  };

  const setScanInterval = (ms: number) => {
    if (scannerRef.current) {
      scannerRef.current.setScanInterval(ms);
    }
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return {
    start,
    stop,
    setScanInterval,
  };
}

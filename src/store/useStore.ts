import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  TokenScore,
  Alert,
  FilterConfig,
  ScannerState,
} from '../types/index';
import { TokenFilter } from '../core/filters';

interface Store extends ScannerState {
  // State setters
  setTokens: (tokens: TokenScore[]) => void;
  addAlert: (alert: Alert) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
  setFilters: (filters: Partial<FilterConfig>) => void;
  setRunning: (running: boolean) => void;
  setLastScanTime: (time: number) => void;
  setHealthy: (healthy: boolean) => void;
}

const initialFilters = TokenFilter.getDefaultConfig();

export const useStore = create<Store>()(
  devtools(
    persist(
      (set) => ({
        isRunning: false,
        lastScanTime: 0,
        tokens: [],
        alerts: [],
        filters: initialFilters,
        isHealthy: true,

        setTokens: (tokens) => set({ tokens, lastScanTime: Date.now() }),
        addAlert: (alert) =>
          set((state) => {
            const alerts = [alert, ...state.alerts].slice(0, 20); // Keep last 20
            return { alerts };
          }),
        removeAlert: (id) =>
          set((state) => ({
            alerts: state.alerts.filter((a) => a.id !== id),
          })),
        clearAlerts: () => set({ alerts: [] }),
        setFilters: (newFilters) =>
          set((state) => ({
            filters: { ...state.filters, ...newFilters },
          })),
        setRunning: (isRunning) => set({ isRunning }),
        setLastScanTime: (lastScanTime) => set({ lastScanTime }),
        setHealthy: (isHealthy) => set({ isHealthy }),
      }),
      {
        name: 'volumesniper-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    )
  )
);

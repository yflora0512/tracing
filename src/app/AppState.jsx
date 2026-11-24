import { createContext, useContext, useEffect, useState } from 'react';

/** Day / Night mode shared across the mirror (헤더 Day/Night 전환 · 자동) */
const AppState = createContext(null);

export const MODE_INFO = {
  day: { time: '08:10', date: '11월 5일 (목) · 12°C', greeting: '좋은 아침이에요, 지수님' },
  night: { time: '21:40', date: '11월 5일 (목) · 8°C', greeting: '오늘도 수고했어요, 지수님' },
};

export function AppStateProvider({ children }) {
  const [mode, setMode] = useState('day');
  return <AppState.Provider value={{ mode, setMode }}>{children}</AppState.Provider>;
}

export const useAppState = () => useContext(AppState);

/** Screens that belong to one time of day switch the mirror to it on entry (자동 전환) */
export function useAutoMode(target) {
  const { setMode } = useAppState();
  useEffect(() => setMode(target), [target, setMode]);
}

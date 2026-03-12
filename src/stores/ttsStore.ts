import { create } from 'zustand';

interface TTSState {
  selectedLanguage: string;
  selectedSpeed: number;
  selectedVoice: string;
  autoPlay: boolean;
  miniPlayerOpen: boolean;

  setLanguage: (language: string) => void;
  setSpeed: (speed: number) => void;
  setVoice: (voice: string) => void;
  setAutoPlay: (autoPlay: boolean) => void;
  setMiniPlayerOpen: (open: boolean) => void;
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) return JSON.parse(stored) as T;
  } catch {
    // ignore parse errors
  }
  return defaultValue;
}

function saveToStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

const STORAGE_PREFIX = 'bible-tts-';

export const useTTSStore = create<TTSState>((set) => ({
  selectedLanguage: loadFromStorage<string>(`${STORAGE_PREFIX}language`, 'ko-KR'),
  selectedSpeed: loadFromStorage<number>(`${STORAGE_PREFIX}speed`, 1.0),
  selectedVoice: loadFromStorage<string>(`${STORAGE_PREFIX}voice`, ''),
  autoPlay: loadFromStorage<boolean>(`${STORAGE_PREFIX}autoPlay`, false),
  miniPlayerOpen: false,

  setLanguage: (language) => {
    saveToStorage(`${STORAGE_PREFIX}language`, language);
    set({ selectedLanguage: language });
  },
  setSpeed: (speed) => {
    saveToStorage(`${STORAGE_PREFIX}speed`, speed);
    set({ selectedSpeed: speed });
  },
  setVoice: (voice) => {
    saveToStorage(`${STORAGE_PREFIX}voice`, voice);
    set({ selectedVoice: voice });
  },
  setAutoPlay: (autoPlay) => {
    saveToStorage(`${STORAGE_PREFIX}autoPlay`, autoPlay);
    set({ autoPlay });
  },
  setMiniPlayerOpen: (open) => set({ miniPlayerOpen: open }),
}));

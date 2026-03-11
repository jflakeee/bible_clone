import { create } from 'zustand';

export type HighlightStyle = 'italic' | 'bold' | 'underline' | 'color';

interface SettingsState {
  highlightProperNouns: boolean;
  highlightStyle: HighlightStyle;
  setHighlightProperNouns: (value: boolean) => void;
  setHighlightStyle: (style: HighlightStyle) => void;
}

// Load persisted settings from localStorage
function loadPersistedSettings(): Partial<Pick<SettingsState, 'highlightProperNouns' | 'highlightStyle'>> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem('bible-settings');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return {};
}

function persistSettings(state: Pick<SettingsState, 'highlightProperNouns' | 'highlightStyle'>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('bible-settings', JSON.stringify(state));
  } catch {
    // ignore
  }
}

const persisted = loadPersistedSettings();

export const useSettingsStore = create<SettingsState>((set, get) => ({
  highlightProperNouns: persisted.highlightProperNouns ?? true,
  highlightStyle: persisted.highlightStyle ?? 'italic',
  setHighlightProperNouns: (value: boolean) => {
    set({ highlightProperNouns: value });
    const s = get();
    persistSettings({ highlightProperNouns: value, highlightStyle: s.highlightStyle });
  },
  setHighlightStyle: (style: HighlightStyle) => {
    set({ highlightStyle: style });
    const s = get();
    persistSettings({ highlightProperNouns: s.highlightProperNouns, highlightStyle: style });
  },
}));

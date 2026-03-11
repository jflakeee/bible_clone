import { useSettingsStore } from '@/stores/settingsStore';

// Mock localStorage
const storage: Record<string, string> = {};
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn((key: string) => storage[key] ?? null),
      setItem: jest.fn((key: string, val: string) => {
        storage[key] = val;
      }),
      removeItem: jest.fn((key: string) => {
        delete storage[key];
      }),
    },
    writable: true,
  });
});

beforeEach(() => {
  for (const key of Object.keys(storage)) delete storage[key];
  jest.clearAllMocks();

  useSettingsStore.setState({
    highlightProperNouns: true,
    highlightStyle: 'italic',
  });
});

describe('settingsStore', () => {
  describe('initial state', () => {
    it('has highlightProperNouns true by default', () => {
      expect(useSettingsStore.getState().highlightProperNouns).toBe(true);
    });

    it('has highlightStyle "italic" by default', () => {
      expect(useSettingsStore.getState().highlightStyle).toBe('italic');
    });
  });

  describe('setHighlightProperNouns', () => {
    it('toggles highlight off', () => {
      useSettingsStore.getState().setHighlightProperNouns(false);
      expect(useSettingsStore.getState().highlightProperNouns).toBe(false);
    });

    it('toggles highlight on', () => {
      useSettingsStore.getState().setHighlightProperNouns(false);
      useSettingsStore.getState().setHighlightProperNouns(true);
      expect(useSettingsStore.getState().highlightProperNouns).toBe(true);
    });

    it('persists to localStorage', () => {
      useSettingsStore.getState().setHighlightProperNouns(false);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'bible-settings',
        expect.stringContaining('"highlightProperNouns":false')
      );
    });

    it('persists both settings together', () => {
      useSettingsStore.getState().setHighlightStyle('bold');
      jest.clearAllMocks();
      useSettingsStore.getState().setHighlightProperNouns(false);

      const calls = (window.localStorage.setItem as jest.Mock).mock.calls;
      const lastCall = calls[calls.length - 1];
      const stored = JSON.parse(lastCall[1]);
      expect(stored.highlightProperNouns).toBe(false);
      expect(stored.highlightStyle).toBe('bold');
    });
  });

  describe('setHighlightStyle', () => {
    it('sets style to bold', () => {
      useSettingsStore.getState().setHighlightStyle('bold');
      expect(useSettingsStore.getState().highlightStyle).toBe('bold');
    });

    it('sets style to underline', () => {
      useSettingsStore.getState().setHighlightStyle('underline');
      expect(useSettingsStore.getState().highlightStyle).toBe('underline');
    });

    it('sets style to color', () => {
      useSettingsStore.getState().setHighlightStyle('color');
      expect(useSettingsStore.getState().highlightStyle).toBe('color');
    });

    it('persists to localStorage', () => {
      useSettingsStore.getState().setHighlightStyle('underline');
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'bible-settings',
        expect.stringContaining('"highlightStyle":"underline"')
      );
    });

    it('persists both settings together', () => {
      useSettingsStore.getState().setHighlightProperNouns(false);
      jest.clearAllMocks();
      useSettingsStore.getState().setHighlightStyle('color');

      const calls = (window.localStorage.setItem as jest.Mock).mock.calls;
      const lastCall = calls[calls.length - 1];
      const stored = JSON.parse(lastCall[1]);
      expect(stored.highlightProperNouns).toBe(false);
      expect(stored.highlightStyle).toBe('color');
    });
  });

  describe('all highlight styles', () => {
    it.each(['italic', 'bold', 'underline', 'color'] as const)(
      'accepts %s as valid style',
      (style) => {
        useSettingsStore.getState().setHighlightStyle(style);
        expect(useSettingsStore.getState().highlightStyle).toBe(style);
      }
    );
  });
});

import { useTTSStore } from '@/stores/ttsStore';

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
  // Clear storage
  for (const key of Object.keys(storage)) delete storage[key];

  // Reset store to defaults
  useTTSStore.setState({
    selectedLanguage: 'ko-KR',
    selectedSpeed: 1.0,
    selectedVoice: '',
    autoPlay: false,
    miniPlayerOpen: false,
  });
});

describe('ttsStore', () => {
  describe('initial state', () => {
    it('has default language "ko-KR"', () => {
      expect(useTTSStore.getState().selectedLanguage).toBe('ko-KR');
    });

    it('has default speed 1.0', () => {
      expect(useTTSStore.getState().selectedSpeed).toBe(1.0);
    });

    it('has default voice empty string', () => {
      expect(useTTSStore.getState().selectedVoice).toBe('');
    });

    it('has autoPlay false', () => {
      expect(useTTSStore.getState().autoPlay).toBe(false);
    });

    it('has miniPlayerOpen false', () => {
      expect(useTTSStore.getState().miniPlayerOpen).toBe(false);
    });
  });

  describe('setLanguage', () => {
    it('updates language', () => {
      useTTSStore.getState().setLanguage('en-US');
      expect(useTTSStore.getState().selectedLanguage).toBe('en-US');
    });

    it('persists to localStorage', () => {
      useTTSStore.getState().setLanguage('en-US');
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'bible-tts-language',
        '"en-US"'
      );
    });
  });

  describe('setSpeed', () => {
    it('updates speed', () => {
      useTTSStore.getState().setSpeed(1.5);
      expect(useTTSStore.getState().selectedSpeed).toBe(1.5);
    });

    it('persists to localStorage', () => {
      useTTSStore.getState().setSpeed(0.75);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'bible-tts-speed',
        '0.75'
      );
    });
  });

  describe('setVoice', () => {
    it('updates voice', () => {
      useTTSStore.getState().setVoice('Korean Voice');
      expect(useTTSStore.getState().selectedVoice).toBe('Korean Voice');
    });

    it('persists to localStorage', () => {
      useTTSStore.getState().setVoice('English Voice');
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'bible-tts-voice',
        '"English Voice"'
      );
    });
  });

  describe('setAutoPlay', () => {
    it('updates autoPlay', () => {
      useTTSStore.getState().setAutoPlay(true);
      expect(useTTSStore.getState().autoPlay).toBe(true);
    });

    it('persists to localStorage', () => {
      useTTSStore.getState().setAutoPlay(true);
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        'bible-tts-autoPlay',
        'true'
      );
    });
  });

  describe('setMiniPlayerOpen', () => {
    it('updates miniPlayerOpen', () => {
      useTTSStore.getState().setMiniPlayerOpen(true);
      expect(useTTSStore.getState().miniPlayerOpen).toBe(true);
    });

    it('does NOT persist miniPlayerOpen to localStorage', () => {
      jest.clearAllMocks();
      useTTSStore.getState().setMiniPlayerOpen(true);
      expect(window.localStorage.setItem).not.toHaveBeenCalled();
    });
  });
});

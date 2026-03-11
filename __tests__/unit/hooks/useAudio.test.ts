/**
 * Unit tests for src/hooks/useAudio.ts
 * Tests play/pause state and speed control.
 */

import { renderHook, act } from '@testing-library/react';
import { useAudio, VerseForAudio } from '@/hooks/useAudio';

// Mock Web Speech API
const mockSpeak = jest.fn();
const mockCancel = jest.fn();
const mockPause = jest.fn();
const mockResume = jest.fn();

let capturedUtterance: SpeechSynthesisUtterance | null = null;

beforeAll(() => {
  // Mock SpeechSynthesisUtterance
  (global as unknown as Record<string, unknown>).SpeechSynthesisUtterance = jest.fn().mockImplementation((text: string) => {
    const utterance = {
      text,
      lang: '',
      rate: 1,
      onend: null as (() => void) | null,
      onerror: null as ((event: { error: string }) => void) | null,
    };
    capturedUtterance = utterance as unknown as SpeechSynthesisUtterance;
    return utterance;
  });

  // Mock speechSynthesis
  Object.defineProperty(window, 'speechSynthesis', {
    value: {
      speak: mockSpeak.mockImplementation(() => {
        // Automatically trigger onend after speak
        if (capturedUtterance && (capturedUtterance as unknown as { onend: (() => void) | null }).onend) {
          setTimeout(() => {
            (capturedUtterance as unknown as { onend: (() => void) | null }).onend?.();
          }, 0);
        }
      }),
      cancel: mockCancel,
      pause: mockPause,
      resume: mockResume,
    },
    writable: true,
    configurable: true,
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  capturedUtterance = null;
});

const sampleVerses: VerseForAudio[] = [
  { verse: 1, text: '태초에 하나님이 천지를 창조하시니라' },
  { verse: 2, text: '땅이 혼돈하고 공허하며' },
  { verse: 3, text: '하나님이 이르시되 빛이 있으라 하시니' },
];

describe('useAudio', () => {
  describe('initial state', () => {
    it('starts with isPlaying false', () => {
      const { result } = renderHook(() => useAudio());
      expect(result.current.isPlaying).toBe(false);
    });

    it('starts with isPaused false', () => {
      const { result } = renderHook(() => useAudio());
      expect(result.current.isPaused).toBe(false);
    });

    it('starts with speed 1.0', () => {
      const { result } = renderHook(() => useAudio());
      expect(result.current.speed).toBe(1.0);
    });

    it('starts with currentVerse 0', () => {
      const { result } = renderHook(() => useAudio());
      expect(result.current.currentVerse).toBe(0);
    });

    it('starts with currentLang ko-KR', () => {
      const { result } = renderHook(() => useAudio());
      expect(result.current.currentLang).toBe('ko-KR');
    });
  });

  describe('speed control', () => {
    it('can set speed to 0.5', () => {
      const { result } = renderHook(() => useAudio());
      act(() => {
        result.current.setSpeed(0.5);
      });
      expect(result.current.speed).toBe(0.5);
    });

    it('can set speed to 2.0', () => {
      const { result } = renderHook(() => useAudio());
      act(() => {
        result.current.setSpeed(2.0);
      });
      expect(result.current.speed).toBe(2.0);
    });

    it('can change speed multiple times', () => {
      const { result } = renderHook(() => useAudio());
      act(() => result.current.setSpeed(0.75));
      expect(result.current.speed).toBe(0.75);

      act(() => result.current.setSpeed(1.5));
      expect(result.current.speed).toBe(1.5);
    });
  });

  describe('language control', () => {
    it('can set current language', () => {
      const { result } = renderHook(() => useAudio());
      act(() => {
        result.current.setCurrentLang('en-US');
      });
      expect(result.current.currentLang).toBe('en-US');
    });
  });

  describe('playChapter', () => {
    it('cancels any ongoing speech before starting', async () => {
      const { result } = renderHook(() => useAudio());

      await act(async () => {
        result.current.playChapter(sampleVerses);
        // Allow microtask to run
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      expect(mockCancel).toHaveBeenCalled();
    });

    it('calls speechSynthesis.speak', async () => {
      const { result } = renderHook(() => useAudio());

      await act(async () => {
        result.current.playChapter(sampleVerses);
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      expect(mockSpeak).toHaveBeenCalled();
    });
  });

  describe('pause', () => {
    it('calls speechSynthesis.pause', () => {
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.pause();
      });

      expect(mockPause).toHaveBeenCalled();
    });

    it('sets isPaused to true', () => {
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.pause();
      });

      expect(result.current.isPaused).toBe(true);
    });

    it('sets isPlaying to false', () => {
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.pause();
      });

      expect(result.current.isPlaying).toBe(false);
    });
  });

  describe('resume', () => {
    it('calls speechSynthesis.resume', () => {
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.resume();
      });

      expect(mockResume).toHaveBeenCalled();
    });

    it('sets isPaused to false', () => {
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.pause();
      });
      expect(result.current.isPaused).toBe(true);

      act(() => {
        result.current.resume();
      });
      expect(result.current.isPaused).toBe(false);
    });

    it('sets isPlaying to true', () => {
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.resume();
      });

      expect(result.current.isPlaying).toBe(true);
    });
  });

  describe('stop', () => {
    it('calls speechSynthesis.cancel', () => {
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.stop();
      });

      expect(mockCancel).toHaveBeenCalled();
    });

    it('resets state', () => {
      const { result } = renderHook(() => useAudio());

      act(() => {
        result.current.stop();
      });

      expect(result.current.isPlaying).toBe(false);
      expect(result.current.isPaused).toBe(false);
      expect(result.current.currentVerse).toBe(0);
    });
  });

  describe('cleanup on unmount', () => {
    it('cancels speech synthesis when unmounted', () => {
      const { unmount } = renderHook(() => useAudio());

      mockCancel.mockClear();
      unmount();

      expect(mockCancel).toHaveBeenCalled();
    });
  });
});

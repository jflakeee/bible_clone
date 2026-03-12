import {
  getLanguageForBook,
  ttsService,
  LANGUAGE_OPTIONS,
  SPEED_OPTIONS,
  TTS_PROVIDERS,
  type TTSConfig,
} from '@/lib/tts-service';

// ── Web Speech API mock ──

const mockCancel = jest.fn();
const mockSpeak = jest.fn();
const mockPause = jest.fn();
const mockResume = jest.fn();
const mockGetVoices = jest.fn().mockReturnValue([
  { name: 'Korean Voice', lang: 'ko-KR' },
  { name: 'English Voice', lang: 'en-US' },
  { name: 'Hebrew Voice', lang: 'he-IL' },
]);

let capturedUtterance: any = null;

beforeAll(() => {
  Object.defineProperty(window, 'speechSynthesis', {
    writable: true,
    value: {
      cancel: mockCancel,
      speak: mockSpeak.mockImplementation((utt: any) => {
        capturedUtterance = utt;
      }),
      pause: mockPause,
      resume: mockResume,
      getVoices: mockGetVoices,
    },
  });

  // Minimal SpeechSynthesisUtterance stub
  (global as any).SpeechSynthesisUtterance = class {
    text: string;
    lang = '';
    rate = 1;
    voice: any = null;
    onend: (() => void) | null = null;
    onerror: ((e: any) => void) | null = null;
    constructor(text: string) {
      this.text = text;
    }
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  capturedUtterance = null;
});

// ── Constants ──

describe('TTS constants', () => {
  it('LANGUAGE_OPTIONS has at least 5 entries', () => {
    expect(LANGUAGE_OPTIONS.length).toBeGreaterThanOrEqual(5);
  });

  it('SPEED_OPTIONS includes 1x speed', () => {
    expect(SPEED_OPTIONS.find((o) => o.value === 1.0)).toBeDefined();
  });

  it('TTS_PROVIDERS has only browser', () => {
    const ids = TTS_PROVIDERS.map((p) => p.id);
    expect(ids).toContain('browser');
    expect(ids).toHaveLength(1);
  });

  it('browser provider is available and not premium', () => {
    const browser = TTS_PROVIDERS.find((p) => p.id === 'browser')!;
    expect(browser.available).toBe(true);
    expect(browser.premium).toBe(false);
  });
});

// ── getLanguageForBook ──

describe('getLanguageForBook', () => {
  it('returns Hebrew for OT books (1-39)', () => {
    expect(getLanguageForBook(1)).toBe('he-IL');
    expect(getLanguageForBook(39)).toBe('he-IL');
  });

  it('returns Greek for NT books (40-66)', () => {
    expect(getLanguageForBook(40)).toBe('el-GR');
    expect(getLanguageForBook(66)).toBe('el-GR');
  });
});

// ── BrowserTTSService (singleton ttsService) ──

describe('BrowserTTSService (ttsService singleton)', () => {
  it('isSupported returns true', () => {
    expect(ttsService.isSupported()).toBe(true);
  });

  it('speak resolves when utterance ends', async () => {
    const config: TTSConfig = { provider: 'browser', language: 'ko-KR', speed: 1.0 };
    const promise = ttsService.speak('test', config);
    // Trigger onend
    capturedUtterance.onend();
    await expect(promise).resolves.toBeUndefined();
  });

  it('speak rejects on error', async () => {
    const config: TTSConfig = { provider: 'browser', language: 'ko-KR', speed: 1.0 };
    const promise = ttsService.speak('test', config);
    capturedUtterance.onerror({ error: 'audio-busy' });
    await expect(promise).rejects.toThrow('audio-busy');
  });

  it('speak rejects with "canceled" on cancel error', async () => {
    const config: TTSConfig = { provider: 'browser', language: 'ko-KR', speed: 1.0 };
    const promise = ttsService.speak('test', config);
    capturedUtterance.onerror({ error: 'canceled' });
    await expect(promise).rejects.toThrow('canceled');
  });

  it('speak sets voice when config.voice matches', async () => {
    const config: TTSConfig = { provider: 'browser', language: 'ko-KR', speed: 1.0, voice: 'Korean Voice' };
    const promise = ttsService.speak('test', config);
    capturedUtterance.onend();
    await promise;
    expect(capturedUtterance.voice).toEqual({ name: 'Korean Voice', lang: 'ko-KR' });
  });

  it('stop calls cancel', () => {
    ttsService.stop();
    expect(mockCancel).toHaveBeenCalled();
  });

  it('pause calls speechSynthesis.pause', () => {
    ttsService.pause();
    expect(mockPause).toHaveBeenCalled();
  });

  it('resume calls speechSynthesis.resume', () => {
    ttsService.resume();
    expect(mockResume).toHaveBeenCalled();
  });

  it('getVoices filters by language prefix', async () => {
    const voices = await ttsService.getVoices('ko-KR');
    expect(voices.length).toBe(1);
    expect(voices[0].name).toBe('Korean Voice');
    expect(voices[0].provider).toBe('browser');
  });
});

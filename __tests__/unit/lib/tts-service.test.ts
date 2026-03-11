import {
  speakText,
  speakHebrew,
  speakGreek,
  getLanguageForBook,
  getAvailableVoices,
  isSpeechSynthesisSupported,
  getTTSService,
  getDefaultTTSService,
  googleTTS,
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

  it('TTS_PROVIDERS has browser, google, bible-brain', () => {
    const ids = TTS_PROVIDERS.map((p) => p.id);
    expect(ids).toContain('browser');
    expect(ids).toContain('google');
    expect(ids).toContain('bible-brain');
  });

  it('browser provider is available and not premium', () => {
    const browser = TTS_PROVIDERS.find((p) => p.id === 'browser')!;
    expect(browser.available).toBe(true);
    expect(browser.premium).toBe(false);
  });
});

// ── speakText / speakHebrew / speakGreek ──

describe('speakText', () => {
  it('cancels previous speech and speaks', () => {
    const utt = speakText('안녕하세요');
    expect(mockCancel).toHaveBeenCalled();
    expect(mockSpeak).toHaveBeenCalled();
    expect(utt).not.toBeNull();
    expect(utt!.lang).toBe('ko-KR');
  });

  it('uses the provided language', () => {
    const utt = speakText('Hello', 'en-US');
    expect(utt!.lang).toBe('en-US');
  });

  it('returns null when window is undefined', () => {
    const orig = window.speechSynthesis;
    Object.defineProperty(window, 'speechSynthesis', { value: undefined, writable: true });
    expect(speakText('test')).toBeNull();
    Object.defineProperty(window, 'speechSynthesis', { value: orig, writable: true });
  });
});

describe('speakHebrew', () => {
  it('speaks with he-IL language', () => {
    const utt = speakHebrew('שלום');
    expect(utt!.lang).toBe('he-IL');
  });
});

describe('speakGreek', () => {
  it('speaks with el-GR language', () => {
    const utt = speakGreek('Χαίρε');
    expect(utt!.lang).toBe('el-GR');
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

// ── getAvailableVoices ──

describe('getAvailableVoices', () => {
  it('returns voices from speechSynthesis', () => {
    const voices = getAvailableVoices();
    expect(voices.length).toBe(3);
  });
});

// ── isSpeechSynthesisSupported ──

describe('isSpeechSynthesisSupported', () => {
  it('returns true when speechSynthesis exists', () => {
    expect(isSpeechSynthesisSupported()).toBe(true);
  });
});

// ── BrowserTTSService ──

describe('BrowserTTSService (via getTTSService)', () => {
  const service = getTTSService('browser');

  it('isSupported returns true', () => {
    expect(service.isSupported()).toBe(true);
  });

  it('speak resolves when utterance ends', async () => {
    const config: TTSConfig = { provider: 'browser', language: 'ko-KR', speed: 1.0 };
    const promise = service.speak('test', config);
    // Trigger onend
    capturedUtterance.onend();
    await expect(promise).resolves.toBeUndefined();
  });

  it('speak rejects on error', async () => {
    const config: TTSConfig = { provider: 'browser', language: 'ko-KR', speed: 1.0 };
    const promise = service.speak('test', config);
    capturedUtterance.onerror({ error: 'audio-busy' });
    await expect(promise).rejects.toThrow('audio-busy');
  });

  it('speak rejects with "canceled" on cancel error', async () => {
    const config: TTSConfig = { provider: 'browser', language: 'ko-KR', speed: 1.0 };
    const promise = service.speak('test', config);
    capturedUtterance.onerror({ error: 'canceled' });
    await expect(promise).rejects.toThrow('canceled');
  });

  it('speak sets voice when config.voice matches', async () => {
    const config: TTSConfig = { provider: 'browser', language: 'ko-KR', speed: 1.0, voice: 'Korean Voice' };
    const promise = service.speak('test', config);
    capturedUtterance.onend();
    await promise;
    expect(capturedUtterance.voice).toEqual({ name: 'Korean Voice', lang: 'ko-KR' });
  });

  it('stop calls cancel', () => {
    service.stop();
    expect(mockCancel).toHaveBeenCalled();
  });

  it('pause calls speechSynthesis.pause', () => {
    service.pause();
    expect(mockPause).toHaveBeenCalled();
  });

  it('resume calls speechSynthesis.resume', () => {
    service.resume();
    expect(mockResume).toHaveBeenCalled();
  });

  it('getVoices filters by language prefix', async () => {
    const voices = await service.getVoices('ko-KR');
    expect(voices.length).toBe(1);
    expect(voices[0].name).toBe('Korean Voice');
    expect(voices[0].provider).toBe('browser');
  });
});

// ── GoogleTTSService ──

describe('GoogleTTSService (via getTTSService)', () => {
  const service = getTTSService('google');

  it('isSupported returns true in browser', () => {
    expect(service.isSupported()).toBe(true);
  });

  it('getVoices returns Google voice names for known language', async () => {
    const voices = await service.getVoices('ko-KR');
    expect(voices.length).toBeGreaterThan(0);
    expect(voices[0].provider).toBe('google');
    expect(voices[0].name).toContain('ko-KR');
  });

  it('getVoices returns empty for unknown language', async () => {
    const voices = await service.getVoices('xx-XX');
    expect(voices.length).toBe(0);
  });
});

// ── BibleBrainTTSService ──

describe('BibleBrainTTSService (via getTTSService)', () => {
  const service = getTTSService('bible-brain');

  it('isSupported returns false', () => {
    expect(service.isSupported()).toBe(false);
  });

  it('speak throws not available error', async () => {
    await expect(
      service.speak('test', { provider: 'bible-brain', language: 'ko-KR', speed: 1 })
    ).rejects.toThrow('not yet available');
  });

  it('getVoices returns empty', async () => {
    const voices = await service.getVoices('ko-KR');
    expect(voices).toEqual([]);
  });
});

// ── googleTTS API call ──

describe('googleTTS', () => {
  it('calls /api/tts and returns ArrayBuffer on success', async () => {
    const mockArrayBuffer = new ArrayBuffer(8);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(mockArrayBuffer),
    });

    const result = await googleTTS('hello', 'en-US', 1.0);
    expect(result).toBe(mockArrayBuffer);
    expect(global.fetch).toHaveBeenCalledWith('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'hello', language: 'en-US', speed: 1.0 }),
    });
  });

  it('throws on non-ok response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'API key missing' }),
    });

    await expect(googleTTS('test', 'ko-KR', 1)).rejects.toThrow('API key missing');
  });

  it('throws generic message when error JSON parse fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.reject(new Error('parse error')),
    });

    await expect(googleTTS('test', 'ko-KR', 1)).rejects.toThrow('Unknown error');
  });
});

// ── Factory ──

describe('getTTSService / getDefaultTTSService', () => {
  it('getDefaultTTSService returns browser service', () => {
    const service = getDefaultTTSService();
    expect(service.isSupported()).toBe(true);
  });

  it('getTTSService returns correct service per provider', () => {
    expect(getTTSService('browser').isSupported()).toBe(true);
    expect(getTTSService('bible-brain').isSupported()).toBe(false);
  });
});

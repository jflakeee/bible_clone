/**
 * TTS (Text-to-Speech) Service
 * Supports multiple backends:
 * - Web Speech API (browser, free, default)
 * - Google Cloud TTS (premium, requires API key)
 * - Bible Brain API (future integration)
 *
 * Also re-exports audio utility functions and constants
 * formerly in audio-api.ts.
 */

export type TTSProvider = 'browser' | 'google' | 'bible-brain';

// ---------------------
// Constants (formerly in audio-api.ts)
// ---------------------

/**
 * Language display names
 */
export const LANGUAGE_OPTIONS: { code: string; label: string }[] = [
  { code: 'ko-KR', label: '한국어' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'he-IL', label: 'עברית (Hebrew)' },
  { code: 'el-GR', label: 'Ελληνικά (Greek)' },
];

/**
 * Speed options for TTS playback
 */
export const SPEED_OPTIONS: { value: number; label: string }[] = [
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1.0, label: '1x' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 2.0, label: '2x' },
];

// ---------------------
// Utility functions (formerly in audio-api.ts)
// ---------------------

/**
 * Speak text using the Web Speech API (SpeechSynthesis)
 */
export function speakText(text: string, lang: string = 'ko-KR'): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
  return utterance;
}

/**
 * Speak Hebrew text
 */
export function speakHebrew(text: string): SpeechSynthesisUtterance | null {
  return speakText(text, 'he-IL');
}

/**
 * Speak Greek text
 */
export function speakGreek(text: string): SpeechSynthesisUtterance | null {
  return speakText(text, 'el-GR');
}

/**
 * Get the appropriate TTS language code for a Bible book
 * Books 1-39 are OT (Hebrew), 40-66 are NT (Greek)
 */
export function getLanguageForBook(bookId: number): string {
  return bookId <= 39 ? 'he-IL' : 'el-GR';
}

/**
 * Get available speech synthesis voices
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

/**
 * Check if speech synthesis is supported in the current browser
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export interface TTSConfig {
  provider: TTSProvider;
  language: string;
  speed: number;
  voice?: string;
}

export interface TTSService {
  speak(text: string, config: TTSConfig): Promise<void>;
  stop(): void;
  pause(): void;
  resume(): void;
  getVoices(language: string): Promise<TTSVoiceInfo[]>;
  isSupported(): boolean;
}

export interface TTSVoiceInfo {
  id: string;
  name: string;
  language: string;
  provider: TTSProvider;
}

// ---------------------
// Browser TTS (Web Speech API)
// ---------------------

class BrowserTTSService implements TTSService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  async speak(text: string, config: TTSConfig): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Web Speech API is not supported in this browser.');
    }

    return new Promise((resolve, reject) => {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = config.language;
      utterance.rate = config.speed;

      if (config.voice) {
        const voices = window.speechSynthesis.getVoices();
        const match = voices.find(v => v.name === config.voice);
        if (match) utterance.voice = match;
      }

      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        if (event.error === 'canceled') {
          reject(new Error('canceled'));
        } else {
          reject(new Error(event.error));
        }
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }

  stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  pause(): void {
    if (this.isSupported()) {
      window.speechSynthesis.pause();
    }
  }

  resume(): void {
    if (this.isSupported()) {
      window.speechSynthesis.resume();
    }
  }

  async getVoices(language: string): Promise<TTSVoiceInfo[]> {
    if (!this.isSupported()) return [];

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = language.split('-')[0];

    return voices
      .filter(v => v.lang.startsWith(langPrefix))
      .map(v => ({
        id: v.name,
        name: v.name,
        language: v.lang,
        provider: 'browser' as TTSProvider,
      }));
  }
}

// ---------------------
// Google Cloud TTS
// ---------------------

class GoogleTTSService implements TTSService {
  private audioElement: HTMLAudioElement | null = null;
  private objectUrl: string | null = null;

  isSupported(): boolean {
    return typeof window !== 'undefined';
  }

  async speak(text: string, config: TTSConfig): Promise<void> {
    this.stop();

    const audioData = await googleTTS(text, config.language, config.speed);
    const blob = new Blob([audioData], { type: 'audio/mp3' });
    this.objectUrl = URL.createObjectURL(blob);

    return new Promise((resolve, reject) => {
      this.audioElement = new Audio(this.objectUrl!);
      this.audioElement.onended = () => {
        this.cleanup();
        resolve();
      };
      this.audioElement.onerror = () => {
        this.cleanup();
        reject(new Error('Failed to play Google TTS audio'));
      };
      this.audioElement.play().catch(reject);
    });
  }

  stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.cleanup();
  }

  pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  resume(): void {
    if (this.audioElement) {
      this.audioElement.play();
    }
  }

  private cleanup(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
    this.audioElement = null;
  }

  async getVoices(language: string): Promise<TTSVoiceInfo[]> {
    // Google Cloud TTS voices would be fetched from the API
    // For now, return a set of common voice names per language
    const voiceMap: Record<string, string[]> = {
      'ko': ['ko-KR-Standard-A', 'ko-KR-Standard-B', 'ko-KR-Wavenet-A'],
      'en': ['en-US-Standard-A', 'en-US-Standard-B', 'en-US-Wavenet-A'],
      'ja': ['ja-JP-Standard-A', 'ja-JP-Standard-B'],
      'zh': ['zh-CN-Standard-A', 'zh-CN-Standard-B'],
      'es': ['es-ES-Standard-A', 'es-ES-Standard-B'],
      'fr': ['fr-FR-Standard-A', 'fr-FR-Standard-B'],
      'de': ['de-DE-Standard-A', 'de-DE-Standard-B'],
      'he': ['he-IL-Standard-A', 'he-IL-Standard-B'],
      'el': ['el-GR-Standard-A'],
    };

    const langPrefix = language.split('-')[0];
    const names = voiceMap[langPrefix] || [];

    return names.map(name => ({
      id: name,
      name,
      language,
      provider: 'google' as TTSProvider,
    }));
  }
}

// ---------------------
// Bible Brain API (placeholder for future integration)
// ---------------------

class BibleBrainTTSService implements TTSService {
  isSupported(): boolean {
    return false; // Not yet implemented
  }

  async speak(_text: string, _config: TTSConfig): Promise<void> {
    throw new Error(
      'Bible Brain API integration is not yet available. Please use browser TTS or Google Cloud TTS.'
    );
  }

  stop(): void {
    // No-op
  }

  pause(): void {
    // No-op
  }

  resume(): void {
    // No-op
  }

  async getVoices(_language: string): Promise<TTSVoiceInfo[]> {
    return [];
  }
}

// ---------------------
// Google Cloud TTS API call
// ---------------------

export async function googleTTS(
  text: string,
  language: string,
  speed: number
): Promise<ArrayBuffer> {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language, speed }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Google TTS request failed');
  }

  return response.arrayBuffer();
}

// ---------------------
// Factory
// ---------------------

const services: Record<TTSProvider, TTSService> = {
  browser: new BrowserTTSService(),
  google: new GoogleTTSService(),
  'bible-brain': new BibleBrainTTSService(),
};

export function getTTSService(provider: TTSProvider): TTSService {
  return services[provider];
}

export function getDefaultTTSService(): TTSService {
  return services.browser;
}

/**
 * Provider display information
 */
export const TTS_PROVIDERS: {
  id: TTSProvider;
  name: string;
  nameKo: string;
  description: string;
  available: boolean;
  premium: boolean;
}[] = [
  {
    id: 'browser',
    name: 'Browser',
    nameKo: '브라우저',
    description: 'Web Speech API (무료)',
    available: true,
    premium: false,
  },
  {
    id: 'google',
    name: 'Google Cloud',
    nameKo: 'Google Cloud',
    description: 'Google Cloud TTS (프리미엄)',
    available: true,
    premium: true,
  },
  {
    id: 'bible-brain',
    name: 'Bible Brain',
    nameKo: 'Bible Brain',
    description: '녹음된 성경 음성 (준비 중)',
    available: false,
    premium: true,
  },
];

/**
 * TTS (Text-to-Speech) Service
 * Browser-based Web Speech API implementation.
 */

export type TTSProvider = 'browser';

// Constants
export const LANGUAGE_OPTIONS: { code: string; label: string }[] = [
  { code: 'ko-KR', label: '한국어' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'he-IL', label: 'עברית (Hebrew)' },
  { code: 'el-GR', label: 'Ελληνικά (Greek)' },
];

export const SPEED_OPTIONS: { value: number; label: string }[] = [
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1.0, label: '1x' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 2.0, label: '2x' },
];

/**
 * Get the appropriate TTS language code for a Bible book
 * Books 1-39 are OT (Hebrew), 40-66 are NT (Greek)
 */
export function getLanguageForBook(bookId: number): string {
  return bookId <= 39 ? 'he-IL' : 'el-GR';
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

export const ttsService = new BrowserTTSService();

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
];

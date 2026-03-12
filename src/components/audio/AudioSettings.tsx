'use client';

import { useState, useEffect } from 'react';
import { SPEED_OPTIONS, LANGUAGE_OPTIONS } from '@/lib/tts-service';

interface AudioSettingsProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  autoPlay?: boolean;
  onAutoPlayChange?: (autoPlay: boolean) => void;
}

export default function AudioSettings({
  speed,
  onSpeedChange,
  language,
  onLanguageChange,
  autoPlay = false,
  onAutoPlayChange,
}: AudioSettingsProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const available = typeof window !== 'undefined' && window.speechSynthesis
        ? window.speechSynthesis.getVoices()
        : [];
      setVoices(available);
    };

    loadVoices();

    // Voices might load asynchronously in some browsers
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, []);

  // Filter voices by selected language
  const filteredVoices = voices.filter(v => v.lang.startsWith(language.split('-')[0]));

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        오디오 설정
      </h3>

      {/* Speed control */}
      <div>
        <label className="mb-2 block text-xs text-gray-500 dark:text-gray-400">
          읽기 속도
        </label>
        <div className="flex flex-wrap gap-1.5">
          {SPEED_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onSpeedChange(opt.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors
                ${speed === opt.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Language selector */}
      <div>
        <label className="mb-2 block text-xs text-gray-500 dark:text-gray-400">
          음성 언어
        </label>
        <select
          value={language}
          onChange={e => onLanguageChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          {LANGUAGE_OPTIONS.map(opt => (
            <option key={opt.code} value={opt.code}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Available voices for selected language */}
      {filteredVoices.length > 0 && (
        <div>
          <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
            사용 가능한 음성 ({filteredVoices.length})
          </label>
          <div className="max-h-24 overflow-y-auto text-xs text-gray-400 dark:text-gray-500">
            {filteredVoices.map((voice, i) => (
              <div key={`${voice.name}-${i}`} className="truncate">
                {voice.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auto-play toggle */}
      {onAutoPlayChange && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            자동 재생
          </span>
          <button
            onClick={() => onAutoPlayChange(!autoPlay)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors
              ${autoPlay ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
            role="switch"
            aria-checked={autoPlay}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform
                ${autoPlay ? 'translate-x-4.5' : 'translate-x-0.5'}`}
            />
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { getTTSService, TTS_PROVIDERS, SPEED_OPTIONS, type TTSProvider } from '@/lib/tts-service';
import { useTTSStore } from '@/stores/ttsStore';
import LanguageSelector from './LanguageSelector';

export interface VerseItem {
  verse: number;
  text: string;
}

interface EnhancedAudioPlayerProps {
  verses: VerseItem[];
  bookName?: string;
  chapter?: number;
}

type PlayerView = 'full' | 'mini';
type PlayerTab = 'player' | 'language' | 'settings';

export default function EnhancedAudioPlayer({
  verses,
  bookName,
  chapter,
}: EnhancedAudioPlayerProps) {
  const {
    selectedProvider,
    selectedLanguage,
    selectedSpeed,
    selectedVoice,
    setProvider,
    setLanguage,
    setSpeed,
    setVoice,
    miniPlayerOpen,
    setMiniPlayerOpen,
  } = useTTSStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState<PlayerTab>('player');
  const [playerView, setPlayerView] = useState<PlayerView>('full');
  const [availableVoices, setAvailableVoices] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [providerError, setProviderError] = useState<string | null>(null);

  const isPlayingRef = useRef(false);
  const currentIndexRef = useRef(0);

  // Load voices when language or provider changes
  useEffect(() => {
    const service = getTTSService(selectedProvider);
    service.getVoices(selectedLanguage).then((voices) => {
      setAvailableVoices(voices.map((v) => v.name));
    });
  }, [selectedProvider, selectedLanguage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const service = getTTSService(selectedProvider);
      service.stop();
      isPlayingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playAll = useCallback(
    async (startIndex: number = 0) => {
      if (verses.length === 0) return;

      const service = getTTSService(selectedProvider);
      service.stop();

      isPlayingRef.current = true;
      setIsPlaying(true);
      setIsPaused(false);
      setProviderError(null);

      for (let i = startIndex; i < verses.length; i++) {
        if (!isPlayingRef.current) break;

        currentIndexRef.current = i;
        setCurrentVerseIndex(i);

        try {
          await service.speak(verses[i].text, {
            provider: selectedProvider,
            language: selectedLanguage,
            speed: selectedSpeed,
            voice: selectedVoice || undefined,
          });
        } catch (err) {
          if (!isPlayingRef.current) break;
          const message = err instanceof Error ? err.message : 'Unknown error';
          if (message === 'canceled') break;
          // If Google fails, suggest browser fallback
          if (selectedProvider === 'google') {
            setProviderError('Google TTS 사용 불가. 브라우저 TTS로 전환해주세요.');
            break;
          }
          // For browser TTS errors, continue to next verse
          console.error('TTS error on verse', verses[i].verse, message);
        }
      }

      if (isPlayingRef.current) {
        isPlayingRef.current = false;
        setIsPlaying(false);
        setCurrentVerseIndex(-1);
      }
    },
    [verses, selectedProvider, selectedLanguage, selectedSpeed, selectedVoice]
  );

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      // Pause
      const service = getTTSService(selectedProvider);
      service.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else if (isPaused) {
      // Resume
      const service = getTTSService(selectedProvider);
      service.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      playAll(0);
    }
  }, [isPlaying, isPaused, selectedProvider, playAll]);

  const handleStop = useCallback(() => {
    const service = getTTSService(selectedProvider);
    service.stop();
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentVerseIndex(-1);
  }, [selectedProvider]);

  const handleVerseClick = useCallback(
    (index: number) => {
      handleStop();
      setTimeout(() => playAll(index), 100);
    },
    [handleStop, playAll]
  );

  const handlePrev = useCallback(() => {
    if (currentVerseIndex > 0) {
      handleStop();
      setTimeout(() => playAll(currentVerseIndex - 1), 100);
    }
  }, [currentVerseIndex, handleStop, playAll]);

  const handleNext = useCallback(() => {
    if (currentVerseIndex < verses.length - 1) {
      handleStop();
      setTimeout(() => playAll(currentVerseIndex + 1), 100);
    }
  }, [currentVerseIndex, verses.length, handleStop, playAll]);

  const progress =
    currentVerseIndex >= 0 && verses.length > 0
      ? ((currentVerseIndex + 1) / verses.length) * 100
      : 0;

  const currentVerse =
    currentVerseIndex >= 0 && currentVerseIndex < verses.length
      ? verses[currentVerseIndex]
      : null;

  // Toggle mini/full player
  const toggleView = () => {
    if (playerView === 'mini') {
      setPlayerView('full');
      setMiniPlayerOpen(false);
    } else {
      setPlayerView('mini');
      setMiniPlayerOpen(true);
    }
  };

  // Mini player bar
  if (playerView === 'mini' && miniPlayerOpen) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 px-4 py-2 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          {/* Progress bar */}
          <div className="h-1 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-1 rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Current info */}
          <div className="flex min-w-0 flex-shrink-0 items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            {bookName && chapter && (
              <span className="truncate">
                {bookName} {chapter}장
              </span>
            )}
            {currentVerse && <span>{currentVerse.verse}절</span>}
          </div>

          {/* Controls */}
          <div className="flex flex-shrink-0 items-center gap-1">
            <button
              onClick={handlePlayPause}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white"
              aria-label={isPlaying ? '일시정지' : '재생'}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M5.75 3a.75.75 0 01.75.75v12.5a.75.75 0 01-1.5 0V3.75A.75.75 0 015.75 3zm8.5 0a.75.75 0 01.75.75v12.5a.75.75 0 01-1.5 0V3.75a.75.75 0 01.75-.75z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 ml-0.5">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleStop}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="정지"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm5-2.25A.75.75 0 017.75 7h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-4.5z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={toggleView}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="확대"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full player
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-blue-500">
            <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
            <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            AI 성경 읽기
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`rounded-lg p-1.5 transition-colors ${
              settingsOpen
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label="설정"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
          {(isPlaying || isPaused) && (
            <button
              onClick={toggleView}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="미니 플레이어"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Settings panel (collapsible) */}
      {settingsOpen && (
        <div className="border-b border-gray-100 px-4 py-4 dark:border-gray-800">
          {/* Tabs */}
          <div className="mb-4 flex gap-1 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800">
            {(
              [
                { id: 'player' as PlayerTab, label: '제공자' },
                { id: 'language' as PlayerTab, label: '언어' },
                { id: 'settings' as PlayerTab, label: '설정' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-800 shadow-sm dark:bg-gray-700 dark:text-gray-200'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Provider selection */}
          {activeTab === 'player' && (
            <div className="space-y-2">
              {TTS_PROVIDERS.map((prov) => (
                <button
                  key={prov.id}
                  onClick={() => {
                    if (prov.available) {
                      setProvider(prov.id);
                      setProviderError(null);
                    }
                  }}
                  disabled={!prov.available}
                  className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all ${
                    selectedProvider === prov.id
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950'
                      : prov.available
                      ? 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600'
                      : 'cursor-not-allowed border-gray-100 bg-gray-50 opacity-50 dark:border-gray-800 dark:bg-gray-950'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {prov.nameKo}
                      </span>
                      {prov.premium && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                          프리미엄
                        </span>
                      )}
                      {!prov.available && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 dark:bg-gray-800">
                          준비 중
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {prov.description}
                    </p>
                  </div>
                  {selectedProvider === prov.id && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 flex-shrink-0 text-blue-500">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Language selection */}
          {activeTab === 'language' && (
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onSelect={(code) => {
                setLanguage(code);
                // Reset voice when language changes
                setVoice('');
              }}
            />
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Speed */}
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">
                  읽기 속도
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SPEED_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSpeed(opt.value)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        selectedSpeed === opt.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice selection */}
              {availableVoices.length > 0 && (
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">
                    음성 선택
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  >
                    <option value="">기본 음성</option>
                    {availableVoices.map((voice) => (
                      <option key={voice} value={voice}>
                        {voice}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Title */}
      {bookName && chapter && (
        <div className="px-4 pt-4 text-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {bookName} {chapter}장
          </span>
        </div>
      )}

      {/* Waveform visualization */}
      <div className="px-4 py-3">
        <div className="flex h-10 items-end justify-center gap-[2px]">
          {Array.from({ length: 40 }).map((_, i) => {
            const barActive =
              isPlaying && verses.length > 0
                ? i / 40 <= (currentVerseIndex + 1) / verses.length
                : false;
            // Generate varied bar heights for waveform look
            const heights = [40, 65, 30, 80, 50, 90, 35, 70, 55, 85, 45, 75, 60, 95, 38, 72, 48, 88, 42, 78,
              52, 68, 58, 92, 36, 82, 44, 76, 56, 86, 46, 74, 62, 94, 34, 84, 50, 70, 54, 88];
            const height = heights[i % heights.length];

            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-200 ${
                  barActive
                    ? 'bg-blue-500 dark:bg-blue-400'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
                style={{
                  height: `${height}%`,
                  animationDelay: `${i * 50}ms`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4">
        <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-1.5 rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-gray-400">
          <span>{currentVerse ? `${currentVerse.verse}절` : '0절'}</span>
          <span>{verses.length}절</span>
        </div>
      </div>

      {/* Error message */}
      {providerError && (
        <div className="mx-4 mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-300">
          {providerError}
        </div>
      )}

      {/* Main controls */}
      <div className="flex items-center justify-center gap-4 px-4 py-4">
        {/* Previous */}
        <button
          onClick={handlePrev}
          disabled={currentVerseIndex <= 0}
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="이전 절"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path d="M4.75 3a.75.75 0 00-.75.75v12.5a.75.75 0 001.5 0V3.75A.75.75 0 004.75 3zm10.115 1.333a.75.75 0 01.135.42v10.494a.75.75 0 01-1.189.61l-6.929-5.246a.75.75 0 010-1.222l6.929-5.247a.75.75 0 011.054.19z" />
          </svg>
        </button>

        {/* Stop */}
        <button
          onClick={handleStop}
          disabled={!isPlaying && !isPaused}
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="정지"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm5-2.25A.75.75 0 017.75 7h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 01-.75-.75v-4.5z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Play / Pause */}
        <button
          onClick={handlePlayPause}
          disabled={verses.length === 0}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition-all hover:bg-blue-600 hover:shadow-xl disabled:opacity-30 dark:bg-blue-600 dark:hover:bg-blue-700"
          aria-label={isPlaying ? '일시정지' : '재생'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={currentVerseIndex >= verses.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="다음 절"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path d="M15.25 3a.75.75 0 01.75.75v12.5a.75.75 0 01-1.5 0V3.75a.75.75 0 01.75-.75zM5.115 4.333a.75.75 0 011.054-.19l6.929 5.247a.75.75 0 010 1.222l-6.929 5.246a.75.75 0 01-1.189-.61V4.753a.75.75 0 01.135-.42z" />
          </svg>
        </button>

        {/* Speed */}
        <button
          onClick={() => {
            const idx = SPEED_OPTIONS.findIndex((s) => s.value === selectedSpeed);
            const next = (idx + 1) % SPEED_OPTIONS.length;
            setSpeed(SPEED_OPTIONS[next].value);
          }}
          className="flex h-10 min-w-[3rem] items-center justify-center rounded-full border border-gray-300 px-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label={`속도: ${selectedSpeed}x`}
          title={`속도: ${selectedSpeed}x (클릭하여 변경)`}
        >
          {selectedSpeed}x
        </button>
      </div>

      {/* Quick language selector */}
      <div className="flex items-center justify-center gap-2 px-4 pb-3">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onSelect={(code) => {
            setLanguage(code);
            setVoice('');
          }}
          compact
        />
      </div>

      {/* Verse timeline */}
      {verses.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
          <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            절 목록
          </div>
          <div className="flex flex-wrap gap-1">
            {verses.map((v, idx) => {
              const isCurrent = idx === currentVerseIndex;
              const isPast = currentVerseIndex >= 0 && idx < currentVerseIndex;
              return (
                <button
                  key={v.verse}
                  onClick={() => handleVerseClick(idx)}
                  className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-medium transition-all ${
                    isCurrent
                      ? 'scale-110 bg-blue-500 text-white shadow-md'
                      : isPast
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                  title={`${v.verse}절: ${v.text.substring(0, 50)}...`}
                >
                  {v.verse}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

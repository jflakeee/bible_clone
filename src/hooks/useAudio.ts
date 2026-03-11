'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface VerseForAudio {
  verse: number;
  text: string;
}

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [currentVerse, setCurrentVerse] = useState(0);
  const [currentLang, setCurrentLang] = useState('ko-KR');
  const versesRef = useRef<VerseForAudio[]>([]);
  const currentIndexRef = useRef(0);
  const isPlayingRef = useRef(false);

  const speakVerse = useCallback((text: string, lang: string, rate: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        // 'canceled' is expected when we stop playback
        if (event.error === 'canceled') {
          reject(new Error('canceled'));
        } else {
          reject(new Error(event.error));
        }
      };

      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const playChapter = useCallback(async (verses: VerseForAudio[], lang: string = 'ko-KR') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    versesRef.current = verses;
    currentIndexRef.current = 0;
    isPlayingRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentLang(lang);

    for (let i = 0; i < verses.length; i++) {
      if (!isPlayingRef.current) break;

      currentIndexRef.current = i;
      setCurrentVerse(verses[i].verse);

      try {
        await speakVerse(verses[i].text, lang, speed);
      } catch {
        // If canceled, stop the loop
        if (!isPlayingRef.current) break;
      }
    }

    if (isPlayingRef.current) {
      // Finished naturally
      isPlayingRef.current = false;
      setIsPlaying(false);
      setCurrentVerse(0);
    }
  }, [speed, speakVerse]);

  const playFromVerse = useCallback(async (verses: VerseForAudio[], startVerse: number, lang: string = 'ko-KR') => {
    const startIndex = verses.findIndex(v => v.verse === startVerse);
    if (startIndex === -1) return;

    const remainingVerses = verses.slice(startIndex);
    await playChapter(remainingVerses, lang);
  }, [playChapter]);

  const pause = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    isPlayingRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentVerse(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      isPlayingRef.current = false;
    };
  }, []);

  return {
    isPlaying,
    isPaused,
    speed,
    setSpeed,
    currentVerse,
    currentLang,
    setCurrentLang,
    playChapter,
    playFromVerse,
    pause,
    resume,
    stop,
  };
}

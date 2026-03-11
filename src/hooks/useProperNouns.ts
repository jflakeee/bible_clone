'use client';

import { useMemo, useCallback } from 'react';
import {
  findProperNouns,
  searchProperNouns,
  getProperNounsByType,
  getProperNounById,
  PROPER_NOUNS,
  type ProperNoun,
  type ProperNounMatch,
} from '@/lib/proper-nouns';
import { useSettingsStore } from '@/stores/settingsStore';

export function useProperNouns() {
  const highlightEnabled = useSettingsStore((s) => s.highlightProperNouns);
  const highlightStyle = useSettingsStore((s) => s.highlightStyle);
  const setHighlightEnabled = useSettingsStore((s) => s.setHighlightProperNouns);
  const setHighlightStyle = useSettingsStore((s) => s.setHighlightStyle);

  const findInText = useCallback(
    (text: string, language: 'ko' | 'en'): ProperNounMatch[] => {
      if (!highlightEnabled) return [];
      return findProperNouns(text, language);
    },
    [highlightEnabled]
  );

  const search = useCallback((query: string): ProperNoun[] => {
    return searchProperNouns(query);
  }, []);

  const getByType = useCallback((type: ProperNoun['type']): ProperNoun[] => {
    return getProperNounsByType(type);
  }, []);

  const getById = useCallback((id: string): ProperNoun | undefined => {
    return getProperNounById(id);
  }, []);

  const allNouns = useMemo(() => PROPER_NOUNS, []);

  return {
    highlightEnabled,
    highlightStyle,
    setHighlightEnabled,
    setHighlightStyle,
    findInText,
    search,
    getByType,
    getById,
    allNouns,
  };
}

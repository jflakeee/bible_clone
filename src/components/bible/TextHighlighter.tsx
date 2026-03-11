'use client';

import { useState, useMemo, useCallback } from 'react';
import { findProperNouns, type ProperNoun } from '@/lib/proper-nouns';
import { useSettingsStore, type HighlightStyle } from '@/stores/settingsStore';
import ProperNounTooltip from './ProperNounTooltip';

interface TextHighlighterProps {
  text: string;
  language: 'ko' | 'en';
  className?: string;
}

function getHighlightClasses(style: HighlightStyle): string {
  const base =
    'cursor-pointer transition-colors hover:underline hover:decoration-dotted';
  switch (style) {
    case 'italic':
      return `${base} italic text-amber-800 dark:text-amber-400`;
    case 'bold':
      return `${base} font-bold text-amber-800 dark:text-amber-400`;
    case 'underline':
      return `${base} underline decoration-amber-600 text-amber-800 dark:text-amber-400 dark:decoration-amber-400`;
    case 'color':
      return `${base} text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 rounded px-0.5`;
    default:
      return `${base} italic text-amber-800 dark:text-amber-400`;
  }
}

export default function TextHighlighter({
  text,
  language,
  className = '',
}: TextHighlighterProps) {
  const highlightEnabled = useSettingsStore((s) => s.highlightProperNouns);
  const highlightStyle = useSettingsStore((s) => s.highlightStyle);

  const [activeNoun, setActiveNoun] = useState<ProperNoun | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const matches = useMemo(() => {
    if (!highlightEnabled) return [];
    return findProperNouns(text, language);
  }, [text, language, highlightEnabled]);

  const handleClick = useCallback(
    (noun: ProperNoun, e: React.MouseEvent<HTMLSpanElement>) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setAnchorRect(rect);
      setActiveNoun(noun);
    },
    []
  );

  const handleClose = useCallback(() => {
    setActiveNoun(null);
    setAnchorRect(null);
  }, []);

  // If no highlighting or no matches, render plain text
  if (!highlightEnabled || matches.length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Build segments
  const segments: React.ReactNode[] = [];
  let lastIndex = 0;
  const highlightClasses = getHighlightClasses(highlightStyle);

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];

    // Add text before this match
    if (match.start > lastIndex) {
      segments.push(
        <span key={`text-${lastIndex}`}>
          {text.slice(lastIndex, match.start)}
        </span>
      );
    }

    // Add highlighted proper noun
    const noun = match.noun;
    segments.push(
      <span
        key={`noun-${match.start}`}
        className={highlightClasses}
        title={`${noun.korean} (${noun.english})`}
        onClick={(e) => handleClick(noun, e)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            setAnchorRect(rect);
            setActiveNoun(noun);
          }
        }}
      >
        {text.slice(match.start, match.end)}
      </span>
    );

    lastIndex = match.end;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push(
      <span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>
    );
  }

  return (
    <>
      <span className={className}>{segments}</span>
      {activeNoun && (
        <ProperNounTooltip
          noun={activeNoun}
          anchorRect={anchorRect}
          onClose={handleClose}
        />
      )}
    </>
  );
}

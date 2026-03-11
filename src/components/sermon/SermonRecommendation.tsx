'use client';

import { useEffect } from 'react';
import { useSermons } from '@/hooks/useSermons';
import SermonCard from './SermonCard';

interface SermonRecommendationProps {
  verses: string[];
  title?: string;
  maxItems?: number;
}

export default function SermonRecommendation({
  verses,
  title = '이 구절의 관련 설교',
  maxItems = 5,
}: SermonRecommendationProps) {
  const { recommendations, loading, error, getRecommendations } = useSermons();

  useEffect(() => {
    if (verses.length > 0) {
      getRecommendations(verses);
    }
  }, [verses, getRecommendations]);

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return null;
  }

  const displayItems = recommendations.slice(0, maxItems);

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <div className="space-y-3">
        {displayItems.map((sermon) => (
          <SermonCard key={sermon.id} sermon={sermon} compact />
        ))}
      </div>
    </div>
  );
}

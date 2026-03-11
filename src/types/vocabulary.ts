export interface VocabularyItem {
  id: string;
  strongsNumber: string;
  lemma: string;
  transliteration: string;
  definition: string;
  shortDefinition: string;
  language: 'hebrew' | 'greek';
  notes: string;
  createdAt: string;
  reviewCount: number;
  lastReviewedAt: string | null;
  mastered: boolean;
}

export type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'review-count' | 'language';

export interface ReadingHistoryEntry {
  id: string;
  actionType: 'view_verse' | 'search' | 'lookup_word' | 'play_tts' | 'bookmark' | 'compare';
  targetType: 'verse' | 'chapter' | 'word' | 'sermon';
  targetId: string;
  targetLabel: string; // human-readable, e.g., "창세기 1장"
  metadata?: Record<string, unknown>;
  createdAt: string; // ISO date
}

export type ActionTypeFilter = ReadingHistoryEntry['actionType'] | 'all';

export interface ReadingStats {
  totalViews: number;
  uniqueChapters: number;
  streakDays: number;
  mostReadBook: string;
}

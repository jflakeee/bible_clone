export interface Bookmark {
  id: string;
  verseRef: string; // e.g., "창세기 1:1"
  version: string;
  bookId: number;
  chapter: number;
  verse: number;
  text: string;
  color: string; // hex color
  note: string;
  createdAt: string; // ISO date
}

export const BOOKMARK_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
] as const;

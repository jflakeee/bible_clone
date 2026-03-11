export interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  verses: string[]; // e.g., ["Gen 1:1", "John 3:16"]
  summary: string;
  content: string;
  tags: string[];
  source: string;
  url?: string;
}

export interface SermonSearchResult {
  sermon: Sermon;
  relevanceScore: number;
  matchedVerses: string[];
}

// 성경 관련 타입 정의

export interface BibleVersion {
  id: string;
  abbreviation: string;
  title: string;
  language: string;
}

export interface Book {
  id: number;
  name: string;
  nameKo: string;
  abbreviation: string;
  testament: 'OT' | 'NT';
  chapters: number;
}

export interface Chapter {
  bookId: number;
  chapter: number;
  verses: Verse[];
}

export interface Verse {
  id: number;
  bookId: number;
  chapter: number;
  verse: number;
  text: string;
  version: string;
}

export interface StrongsEntry {
  number: string; // H1234 or G1234
  lemma: string;
  transliteration: string;
  pronunciation: string;
  definition: string;
  shortDefinition: string;
  language: 'hebrew' | 'greek';
}

export interface VerseWord {
  word: string;
  strongsNumber?: string;
  morphology?: string;
  transliteration?: string;
  gloss?: string;
}

export interface CompareResult {
  verse: number;
  versions: {
    abbreviation: string;
    text: string;
  }[];
}

export interface SearchResult {
  version: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  highlight: string;
}

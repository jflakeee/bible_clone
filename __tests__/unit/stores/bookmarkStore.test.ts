import { useBookmarkStore } from '@/stores/bookmarkStore';

beforeEach(() => {
  useBookmarkStore.setState({ bookmarks: [] });
});

describe('bookmarkStore', () => {
  describe('addBookmark', () => {
    it('adds a bookmark with generated id and createdAt', () => {
      useBookmarkStore.getState().addBookmark({
        verseRef: '창세기 1:1',
        version: 'krv',
        bookId: 1,
        chapter: 1,
        verse: 1,
        text: '태초에 하나님이 천지를 창조하시니라',
        color: '#FF6B6B',
        note: 'test note',
      });

      const bookmarks = useBookmarkStore.getState().bookmarks;
      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].id).toBeDefined();
      expect(bookmarks[0].createdAt).toBeDefined();
      expect(bookmarks[0].verseRef).toBe('창세기 1:1');
      expect(bookmarks[0].note).toBe('test note');
    });

    it('adds multiple bookmarks', () => {
      const { addBookmark } = useBookmarkStore.getState();
      addBookmark({
        verseRef: '창세기 1:1', version: 'krv', bookId: 1, chapter: 1, verse: 1,
        text: 'text1', color: '#FF6B6B', note: '',
      });
      addBookmark({
        verseRef: '창세기 1:2', version: 'krv', bookId: 1, chapter: 1, verse: 2,
        text: 'text2', color: '#4ECDC4', note: '',
      });

      expect(useBookmarkStore.getState().bookmarks).toHaveLength(2);
    });
  });

  describe('removeBookmark', () => {
    it('removes bookmark by id', () => {
      useBookmarkStore.getState().addBookmark({
        verseRef: '창세기 1:1', version: 'krv', bookId: 1, chapter: 1, verse: 1,
        text: 'text', color: '#FF6B6B', note: '',
      });

      const id = useBookmarkStore.getState().bookmarks[0].id;
      useBookmarkStore.getState().removeBookmark(id);

      expect(useBookmarkStore.getState().bookmarks).toHaveLength(0);
    });

    it('does nothing with invalid id', () => {
      useBookmarkStore.getState().addBookmark({
        verseRef: '창세기 1:1', version: 'krv', bookId: 1, chapter: 1, verse: 1,
        text: 'text', color: '#FF6B6B', note: '',
      });

      useBookmarkStore.getState().removeBookmark('nonexistent');
      expect(useBookmarkStore.getState().bookmarks).toHaveLength(1);
    });
  });

  describe('updateBookmark', () => {
    it('updates bookmark properties', () => {
      useBookmarkStore.getState().addBookmark({
        verseRef: '창세기 1:1', version: 'krv', bookId: 1, chapter: 1, verse: 1,
        text: 'text', color: '#FF6B6B', note: '',
      });

      const id = useBookmarkStore.getState().bookmarks[0].id;
      useBookmarkStore.getState().updateBookmark(id, {
        note: 'updated note',
        color: '#4ECDC4',
      });

      const updated = useBookmarkStore.getState().bookmarks[0];
      expect(updated.note).toBe('updated note');
      expect(updated.color).toBe('#4ECDC4');
    });
  });

  describe('getBookmarksByChapter', () => {
    it('returns bookmarks for specific chapter', () => {
      const { addBookmark } = useBookmarkStore.getState();
      addBookmark({
        verseRef: '창세기 1:1', version: 'krv', bookId: 1, chapter: 1, verse: 1,
        text: 't1', color: '#FF6B6B', note: '',
      });
      addBookmark({
        verseRef: '창세기 1:2', version: 'krv', bookId: 1, chapter: 1, verse: 2,
        text: 't2', color: '#FF6B6B', note: '',
      });
      addBookmark({
        verseRef: '창세기 2:1', version: 'krv', bookId: 1, chapter: 2, verse: 1,
        text: 't3', color: '#FF6B6B', note: '',
      });

      const ch1 = useBookmarkStore.getState().getBookmarksByChapter(1, 1);
      expect(ch1).toHaveLength(2);

      const ch2 = useBookmarkStore.getState().getBookmarksByChapter(1, 2);
      expect(ch2).toHaveLength(1);
    });

    it('returns empty array for chapter with no bookmarks', () => {
      const result = useBookmarkStore.getState().getBookmarksByChapter(99, 1);
      expect(result).toEqual([]);
    });
  });

  describe('isBookmarked', () => {
    it('returns true for bookmarked verse', () => {
      useBookmarkStore.getState().addBookmark({
        verseRef: '창세기 1:1', version: 'krv', bookId: 1, chapter: 1, verse: 1,
        text: 'text', color: '#FF6B6B', note: '',
      });

      expect(useBookmarkStore.getState().isBookmarked(1, 1, 1)).toBe(true);
    });

    it('returns false for non-bookmarked verse', () => {
      expect(useBookmarkStore.getState().isBookmarked(1, 1, 1)).toBe(false);
    });
  });

  describe('getBookmarkForVerse', () => {
    it('returns bookmark for specific verse', () => {
      useBookmarkStore.getState().addBookmark({
        verseRef: '창세기 1:1', version: 'krv', bookId: 1, chapter: 1, verse: 1,
        text: 'text', color: '#FF6B6B', note: 'my note',
      });

      const bm = useBookmarkStore.getState().getBookmarkForVerse(1, 1, 1);
      expect(bm).toBeDefined();
      expect(bm!.note).toBe('my note');
    });

    it('returns undefined when no bookmark exists', () => {
      const bm = useBookmarkStore.getState().getBookmarkForVerse(1, 1, 1);
      expect(bm).toBeUndefined();
    });
  });
});

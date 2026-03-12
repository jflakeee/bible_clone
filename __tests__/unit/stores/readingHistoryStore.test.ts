import { useHistoryStore } from '@/stores/historyStore';

beforeEach(() => {
  useHistoryStore.setState({
    recentChapters: [],
    dailyVerse: null,
    streakDays: 0,
    totalVersesRead: 0,
    lastReadDate: null,
  });
});

describe('readingHistoryStore', () => {
  describe('addChapterVisit', () => {
    it('adds a chapter visit with timestamp', () => {
      useHistoryStore.getState().addChapterVisit({
        version: 'krv',
        bookId: 1,
        bookName: '창세기',
        chapter: 1,
      });

      const chapters = useHistoryStore.getState().recentChapters;
      expect(chapters).toHaveLength(1);
      expect(chapters[0].bookName).toBe('창세기');
      expect(chapters[0].timestamp).toBeDefined();
    });

    it('removes duplicate and moves to front', () => {
      const { addChapterVisit } = useHistoryStore.getState();
      addChapterVisit({ version: 'krv', bookId: 1, bookName: '창세기', chapter: 1 });
      addChapterVisit({ version: 'krv', bookId: 1, bookName: '창세기', chapter: 2 });
      addChapterVisit({ version: 'krv', bookId: 1, bookName: '창세기', chapter: 1 });

      const chapters = useHistoryStore.getState().recentChapters;
      expect(chapters).toHaveLength(2);
      expect(chapters[0].chapter).toBe(1);
      expect(chapters[1].chapter).toBe(2);
    });

    it('keeps max 20 entries', () => {
      const { addChapterVisit } = useHistoryStore.getState();
      for (let i = 1; i <= 25; i++) {
        addChapterVisit({ version: 'krv', bookId: 1, bookName: '창세기', chapter: i });
      }

      expect(useHistoryStore.getState().recentChapters).toHaveLength(20);
    });

    it('sets streak to 1 on first visit', () => {
      useHistoryStore.getState().addChapterVisit({
        version: 'krv', bookId: 1, bookName: '창세기', chapter: 1,
      });

      expect(useHistoryStore.getState().streakDays).toBe(1);
    });

    it('increments streak when last read was yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      useHistoryStore.setState({
        streakDays: 3,
        lastReadDate: yesterdayStr,
      });

      useHistoryStore.getState().addChapterVisit({
        version: 'krv', bookId: 1, bookName: '창세기', chapter: 1,
      });

      expect(useHistoryStore.getState().streakDays).toBe(4);
    });

    it('resets streak when last read was more than 1 day ago', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      useHistoryStore.setState({
        streakDays: 5,
        lastReadDate: twoDaysAgo.toISOString().split('T')[0],
      });

      useHistoryStore.getState().addChapterVisit({
        version: 'krv', bookId: 1, bookName: '창세기', chapter: 1,
      });

      expect(useHistoryStore.getState().streakDays).toBe(1);
    });

    it('does not change streak for same day visit', () => {
      const today = new Date().toISOString().split('T')[0];
      useHistoryStore.setState({
        streakDays: 3,
        lastReadDate: today,
      });

      useHistoryStore.getState().addChapterVisit({
        version: 'krv', bookId: 1, bookName: '창세기', chapter: 1,
      });

      expect(useHistoryStore.getState().streakDays).toBe(3);
    });

    it('updates lastReadDate to today', () => {
      useHistoryStore.getState().addChapterVisit({
        version: 'krv', bookId: 1, bookName: '창세기', chapter: 1,
      });

      const today = new Date().toISOString().split('T')[0];
      expect(useHistoryStore.getState().lastReadDate).toBe(today);
    });
  });

  describe('setDailyVerse', () => {
    it('sets the daily verse', () => {
      useHistoryStore.getState().setDailyVerse({
        verse: 1,
        text: 'test verse',
        reference: 'Gen 1:1',
        date: '2024-01-01',
      });

      expect(useHistoryStore.getState().dailyVerse).toEqual({
        verse: 1,
        text: 'test verse',
        reference: 'Gen 1:1',
        date: '2024-01-01',
      });
    });
  });

  describe('addVersesRead', () => {
    it('increments total verses read', () => {
      useHistoryStore.getState().addVersesRead(10);
      expect(useHistoryStore.getState().totalVersesRead).toBe(10);

      useHistoryStore.getState().addVersesRead(5);
      expect(useHistoryStore.getState().totalVersesRead).toBe(15);
    });
  });
});

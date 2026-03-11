import { useHistoryStore } from '@/stores/historyStore';

beforeEach(() => {
  useHistoryStore.setState({ history: [] });
});

describe('historyStore', () => {
  describe('addHistory', () => {
    it('adds entry with generated id and createdAt', () => {
      useHistoryStore.getState().addHistory({
        actionType: 'view_verse',
        targetType: 'chapter',
        targetId: '1-1',
        targetLabel: '창세기 1장',
      });

      const history = useHistoryStore.getState().history;
      expect(history).toHaveLength(1);
      expect(history[0].id).toBeDefined();
      expect(history[0].createdAt).toBeDefined();
      expect(history[0].targetLabel).toBe('창세기 1장');
    });

    it('prepends new entries (newest first)', () => {
      const { addHistory } = useHistoryStore.getState();
      addHistory({
        actionType: 'view_verse', targetType: 'chapter',
        targetId: '1-1', targetLabel: '창세기 1장',
      });
      addHistory({
        actionType: 'view_verse', targetType: 'chapter',
        targetId: '1-2', targetLabel: '창세기 2장',
      });

      const history = useHistoryStore.getState().history;
      expect(history[0].targetLabel).toBe('창세기 2장');
      expect(history[1].targetLabel).toBe('창세기 1장');
    });

    it('limits history to 500 entries', () => {
      const { addHistory } = useHistoryStore.getState();
      for (let i = 0; i < 510; i++) {
        addHistory({
          actionType: 'view_verse', targetType: 'chapter',
          targetId: `1-${i}`, targetLabel: `Test ${i}`,
        });
      }

      expect(useHistoryStore.getState().history).toHaveLength(500);
    });
  });

  describe('getRecentHistory', () => {
    it('returns limited number of entries', () => {
      const { addHistory } = useHistoryStore.getState();
      for (let i = 0; i < 10; i++) {
        addHistory({
          actionType: 'view_verse', targetType: 'chapter',
          targetId: `1-${i}`, targetLabel: `Test ${i}`,
        });
      }

      const recent = useHistoryStore.getState().getRecentHistory(3);
      expect(recent).toHaveLength(3);
    });

    it('returns all entries if limit exceeds count', () => {
      useHistoryStore.getState().addHistory({
        actionType: 'view_verse', targetType: 'chapter',
        targetId: '1-1', targetLabel: 'Test',
      });

      const recent = useHistoryStore.getState().getRecentHistory(100);
      expect(recent).toHaveLength(1);
    });
  });

  describe('getHistoryByType', () => {
    it('filters by action type', () => {
      const { addHistory } = useHistoryStore.getState();
      addHistory({
        actionType: 'view_verse', targetType: 'chapter',
        targetId: '1-1', targetLabel: 'View 1',
      });
      addHistory({
        actionType: 'search', targetType: 'verse',
        targetId: 'search-1', targetLabel: 'Search 1',
      });
      addHistory({
        actionType: 'view_verse', targetType: 'chapter',
        targetId: '1-2', targetLabel: 'View 2',
      });

      const views = useHistoryStore.getState().getHistoryByType('view_verse');
      expect(views).toHaveLength(2);

      const searches = useHistoryStore.getState().getHistoryByType('search');
      expect(searches).toHaveLength(1);
    });
  });

  describe('getReadingStats', () => {
    it('returns zero stats for empty history', () => {
      const stats = useHistoryStore.getState().getReadingStats();
      expect(stats.totalViews).toBe(0);
      expect(stats.uniqueChapters).toBe(0);
      expect(stats.streakDays).toBe(0);
      expect(stats.mostReadBook).toBe('-');
    });

    it('counts total views', () => {
      const { addHistory } = useHistoryStore.getState();
      addHistory({
        actionType: 'view_verse', targetType: 'chapter',
        targetId: '1-1', targetLabel: '창세기 1장',
      });
      addHistory({
        actionType: 'view_verse', targetType: 'chapter',
        targetId: '1-2', targetLabel: '창세기 2장',
      });

      const stats = useHistoryStore.getState().getReadingStats();
      expect(stats.totalViews).toBe(2);
    });

    it('counts unique chapters', () => {
      const { addHistory } = useHistoryStore.getState();
      addHistory({
        actionType: 'view_verse', targetType: 'chapter',
        targetId: '1-1', targetLabel: '창세기 1장',
      });
      addHistory({
        actionType: 'view_verse', targetType: 'chapter',
        targetId: '1-1', targetLabel: '창세기 1장',
      });

      const stats = useHistoryStore.getState().getReadingStats();
      expect(stats.uniqueChapters).toBe(1);
    });

    it('identifies most read book', () => {
      const { addHistory } = useHistoryStore.getState();
      addHistory({
        actionType: 'view_verse', targetType: 'chapter',
        targetId: '1-1', targetLabel: '창세기 1장',
      });
      addHistory({
        actionType: 'view_verse', targetType: 'chapter',
        targetId: '1-2', targetLabel: '창세기 2장',
      });
      addHistory({
        actionType: 'view_verse', targetType: 'chapter',
        targetId: '40-1', targetLabel: '마태복음 1장',
      });

      const stats = useHistoryStore.getState().getReadingStats();
      expect(stats.mostReadBook).toBe('창세기');
    });
  });

  describe('clearHistory', () => {
    it('removes all history', () => {
      useHistoryStore.getState().addHistory({
        actionType: 'view_verse', targetType: 'chapter',
        targetId: '1-1', targetLabel: 'Test',
      });

      useHistoryStore.getState().clearHistory();
      expect(useHistoryStore.getState().history).toEqual([]);
    });
  });
});

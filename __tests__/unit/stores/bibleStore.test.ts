import { useBibleStore } from '@/stores/bibleStore';

// Zustand stores are singletons; reset state between tests
beforeEach(() => {
  useBibleStore.setState({
    currentVersion: 'krv',
    currentBook: 1,
    currentChapter: 1,
  });
});

describe('bibleStore', () => {
  describe('initial state', () => {
    it('has default version "krv"', () => {
      expect(useBibleStore.getState().currentVersion).toBe('krv');
    });

    it('has default book 1 (Genesis)', () => {
      expect(useBibleStore.getState().currentBook).toBe(1);
    });

    it('has default chapter 1', () => {
      expect(useBibleStore.getState().currentChapter).toBe(1);
    });
  });

  describe('setVersion', () => {
    it('updates currentVersion', () => {
      useBibleStore.getState().setVersion('kjv');
      expect(useBibleStore.getState().currentVersion).toBe('kjv');
    });

    it('does not affect other state properties', () => {
      useBibleStore.getState().setBook(5);
      useBibleStore.getState().setChapter(3);
      useBibleStore.getState().setVersion('web');

      expect(useBibleStore.getState().currentBook).toBe(5);
      expect(useBibleStore.getState().currentChapter).toBe(3);
    });
  });

  describe('setBook', () => {
    it('updates currentBook', () => {
      useBibleStore.getState().setBook(43);
      expect(useBibleStore.getState().currentBook).toBe(43);
    });

    it('does not affect other state properties', () => {
      useBibleStore.getState().setVersion('kjv');
      useBibleStore.getState().setChapter(10);
      useBibleStore.getState().setBook(19);

      expect(useBibleStore.getState().currentVersion).toBe('kjv');
      expect(useBibleStore.getState().currentChapter).toBe(10);
    });
  });

  describe('setChapter', () => {
    it('updates currentChapter', () => {
      useBibleStore.getState().setChapter(25);
      expect(useBibleStore.getState().currentChapter).toBe(25);
    });

    it('does not affect other state properties', () => {
      useBibleStore.getState().setVersion('web');
      useBibleStore.getState().setBook(40);
      useBibleStore.getState().setChapter(15);

      expect(useBibleStore.getState().currentVersion).toBe('web');
      expect(useBibleStore.getState().currentBook).toBe(40);
    });
  });

  describe('multiple sequential updates', () => {
    it('handles rapid state changes correctly', () => {
      const { setVersion, setBook, setChapter } = useBibleStore.getState();
      setVersion('kjv');
      setBook(66);
      setChapter(22);

      const state = useBibleStore.getState();
      expect(state.currentVersion).toBe('kjv');
      expect(state.currentBook).toBe(66);
      expect(state.currentChapter).toBe(22);
    });
  });
});

import { BIBLE_BOOKS, SUPPORTED_VERSIONS, VERSION_MAP, BOOK_ID_MAP } from '@/lib/constants';

describe('BIBLE_BOOKS', () => {
  it('should contain 66 books', () => {
    expect(BIBLE_BOOKS).toHaveLength(66);
  });

  it('should have 39 OT books and 27 NT books', () => {
    const ot = BIBLE_BOOKS.filter((b) => b.testament === 'OT');
    const nt = BIBLE_BOOKS.filter((b) => b.testament === 'NT');
    expect(ot).toHaveLength(39);
    expect(nt).toHaveLength(27);
  });

  it('should start with Genesis and end with Revelation', () => {
    expect(BIBLE_BOOKS[0].name).toBe('Genesis');
    expect(BIBLE_BOOKS[0].nameKo).toBe('창세기');
    expect(BIBLE_BOOKS[65].name).toBe('Revelation');
    expect(BIBLE_BOOKS[65].nameKo).toBe('요한계시록');
  });

  it('should have sequential IDs from 1 to 66', () => {
    BIBLE_BOOKS.forEach((book, index) => {
      expect(book.id).toBe(index + 1);
    });
  });
});

describe('SUPPORTED_VERSIONS', () => {
  it('should contain 3 versions', () => {
    expect(SUPPORTED_VERSIONS).toHaveLength(3);
  });

  it('should include krv, kjv, and web', () => {
    const ids = SUPPORTED_VERSIONS.map((v) => v.id);
    expect(ids).toContain('krv');
    expect(ids).toContain('kjv');
    expect(ids).toContain('web');
  });
});

describe('VERSION_MAP', () => {
  it('should map all supported versions', () => {
    expect(VERSION_MAP.bsb).toBe('BSB');
    expect(VERSION_MAP.web).toBe('ENGWEBP');
  });
});

describe('BOOK_ID_MAP', () => {
  it('should map all 66 books', () => {
    expect(Object.keys(BOOK_ID_MAP)).toHaveLength(66);
  });

  it('should map Genesis to GEN', () => {
    expect(BOOK_ID_MAP['Genesis']).toBe('GEN');
  });

  it('should map Revelation to REV', () => {
    expect(BOOK_ID_MAP['Revelation']).toBe('REV');
  });
});

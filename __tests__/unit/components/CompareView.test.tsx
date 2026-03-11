import { render, screen } from '@testing-library/react';
import CompareView from '@/components/bible/CompareView';
import { CompareResult } from '@/types/bible';

// Mock constants
jest.mock('@/lib/constants', () => ({
  SUPPORTED_VERSIONS: [
    { id: 'krv', name: '개역한글', language: 'ko' },
    { id: 'kjv', name: 'King James Version', language: 'en' },
    { id: 'web', name: 'World English Bible', language: 'en' },
  ],
  BIBLE_BOOKS: [],
}));

const mockResults: CompareResult[] = [
  {
    verse: 1,
    versions: [
      { abbreviation: 'krv', text: '태초에 하나님이 천지를 창조하시니라' },
      { abbreviation: 'kjv', text: 'In the beginning God created the heaven and the earth.' },
    ],
  },
  {
    verse: 2,
    versions: [
      { abbreviation: 'krv', text: '땅이 혼돈하고 공허하며' },
      { abbreviation: 'kjv', text: 'And the earth was without form, and void' },
    ],
  },
];

describe('CompareView', () => {
  describe('empty state', () => {
    it('shows placeholder message when results are empty', () => {
      render(<CompareView results={[]} versions={['krv', 'kjv']} />);
      expect(screen.getByText('비교할 구절을 선택해주세요.')).toBeInTheDocument();
    });
  });

  describe('desktop table layout', () => {
    it('renders a table with version headers', () => {
      render(<CompareView results={mockResults} versions={['krv', 'kjv']} />);
      // Both desktop and mobile render version names, so use getAllByText
      const krvLabels = screen.getAllByText('개역한글');
      expect(krvLabels.length).toBeGreaterThanOrEqual(1);
      const kjvLabels = screen.getAllByText('King James Version');
      expect(kjvLabels.length).toBeGreaterThanOrEqual(1);
    });

    it('renders verse numbers in the table', () => {
      render(<CompareView results={mockResults} versions={['krv', 'kjv']} />);
      // Desktop table shows verse numbers as plain numbers
      const cells = screen.getAllByText('1');
      expect(cells.length).toBeGreaterThanOrEqual(1);
      const cells2 = screen.getAllByText('2');
      expect(cells2.length).toBeGreaterThanOrEqual(1);
    });

    it('renders verse texts for each version', () => {
      render(<CompareView results={mockResults} versions={['krv', 'kjv']} />);
      // Both desktop and mobile render the same verse texts
      expect(screen.getAllByText('태초에 하나님이 천지를 창조하시니라').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('In the beginning God created the heaven and the earth.').length).toBeGreaterThanOrEqual(1);
    });

    it('renders the "절" column header', () => {
      render(<CompareView results={mockResults} versions={['krv', 'kjv']} />);
      expect(screen.getByText('절')).toBeInTheDocument();
    });
  });

  describe('mobile card layout', () => {
    it('renders mobile cards with verse number and "절" suffix', () => {
      render(<CompareView results={mockResults} versions={['krv', 'kjv']} />);
      // Mobile layout shows "1절", "2절"
      expect(screen.getByText('1절')).toBeInTheDocument();
      expect(screen.getByText('2절')).toBeInTheDocument();
    });

    it('renders version names inside mobile cards', () => {
      render(<CompareView results={mockResults} versions={['krv', 'kjv']} />);
      // Both desktop and mobile render version names; getAllByText to handle duplicates
      const krvLabels = screen.getAllByText('개역한글');
      expect(krvLabels.length).toBeGreaterThanOrEqual(2); // table header + mobile cards
    });
  });

  describe('missing verse text', () => {
    it('shows "구절 없음" when verse text is empty', () => {
      const resultsWithEmpty: CompareResult[] = [
        {
          verse: 1,
          versions: [
            { abbreviation: 'krv', text: '' },
            { abbreviation: 'kjv', text: 'Some text' },
          ],
        },
      ];
      render(<CompareView results={resultsWithEmpty} versions={['krv', 'kjv']} />);
      const emptyLabels = screen.getAllByText('구절 없음');
      expect(emptyLabels.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('version name fallback', () => {
    it('uses abbreviation as fallback when version not found in SUPPORTED_VERSIONS', () => {
      const results: CompareResult[] = [
        {
          verse: 1,
          versions: [
            { abbreviation: 'unknown_v', text: 'test text' },
          ],
        },
      ];
      render(<CompareView results={results} versions={['unknown_v']} />);
      // The header should show the raw abbreviation as fallback
      const labels = screen.getAllByText('unknown_v');
      expect(labels.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('multiple versions', () => {
    it('renders three versions side by side', () => {
      const threeVersionResults: CompareResult[] = [
        {
          verse: 1,
          versions: [
            { abbreviation: 'krv', text: '한국어 텍스트' },
            { abbreviation: 'kjv', text: 'KJV text' },
            { abbreviation: 'web', text: 'WEB text' },
          ],
        },
      ];
      render(
        <CompareView
          results={threeVersionResults}
          versions={['krv', 'kjv', 'web']}
        />
      );
      expect(screen.getAllByText('개역한글').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('King James Version').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('World English Bible').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('한국어 텍스트').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('KJV text').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('WEB text').length).toBeGreaterThanOrEqual(1);
    });
  });
});

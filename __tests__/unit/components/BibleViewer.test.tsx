import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BibleViewer from '@/components/bible/BibleViewer';

// Mock child components that are not the focus of this test
jest.mock('@/components/bible/TextHighlighter', () => {
  return function MockTextHighlighter({
    text,
    className,
  }: {
    text: string;
    className?: string;
  }) {
    return <span className={className}>{text}</span>;
  };
});

jest.mock('@/components/bible/VerseActionMenu', () => {
  return function MockVerseActionMenu({
    verse,
    onClose,
  }: {
    verse: number;
    onClose: () => void;
  }) {
    return (
      <div data-testid="verse-action-menu">
        <span>Verse {verse} menu</span>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

const sampleVerses = [
  { verse: 1, text: 'In the beginning God created the heavens and the earth.' },
  {
    verse: 2,
    text: 'And the earth was without form, and void.',
  },
  { verse: 3, text: 'And God said, Let there be light.' },
];

describe('BibleViewer', () => {
  describe('rendering verses', () => {
    it('renders all verse texts', () => {
      render(
        <BibleViewer
          verses={sampleVerses}
          bookName="Genesis"
          chapter={1}
        />
      );

      expect(screen.getByText(sampleVerses[0].text)).toBeInTheDocument();
      expect(screen.getByText(sampleVerses[1].text)).toBeInTheDocument();
      expect(screen.getByText(sampleVerses[2].text)).toBeInTheDocument();
    });

    it('displays verse numbers as superscript', () => {
      render(
        <BibleViewer
          verses={sampleVerses}
          bookName="Genesis"
          chapter={1}
        />
      );

      const sups = document.querySelectorAll('sup');
      expect(sups).toHaveLength(3);
      expect(sups[0].textContent).toBe('1');
      expect(sups[1].textContent).toBe('2');
      expect(sups[2].textContent).toBe('3');
    });
  });

  describe('empty / no verses', () => {
    it('shows empty message when verses array is empty', () => {
      render(
        <BibleViewer verses={[]} bookName="Genesis" chapter={1} />
      );

      expect(
        screen.getByText('해당 장의 내용을 불러올 수 없습니다.')
      ).toBeInTheDocument();
    });

    it('shows empty message when verses is undefined-like (cast)', () => {
      render(
        <BibleViewer
          verses={null as unknown as { verse: number; text: string }[]}
          bookName="Genesis"
          chapter={1}
        />
      );

      expect(
        screen.getByText('해당 장의 내용을 불러올 수 없습니다.')
      ).toBeInTheDocument();
    });
  });

  describe('verse click interaction', () => {
    it('shows verse action menu when a verse is clicked', () => {
      render(
        <BibleViewer
          verses={sampleVerses}
          bookName="Genesis"
          chapter={1}
        />
      );

      // No menu initially
      expect(
        screen.queryByTestId('verse-action-menu')
      ).not.toBeInTheDocument();

      // Click the first verse span (the parent <span> wrapping sup + text)
      const verseSpans = document.querySelectorAll('span.group');
      fireEvent.click(verseSpans[0]);

      expect(screen.getByTestId('verse-action-menu')).toBeInTheDocument();
      expect(screen.getByText('Verse 1 menu')).toBeInTheDocument();
    });

    it('closes the menu when onClose is called', () => {
      render(
        <BibleViewer
          verses={sampleVerses}
          bookName="Genesis"
          chapter={1}
        />
      );

      const verseSpans = document.querySelectorAll('span.group');
      fireEvent.click(verseSpans[0]);
      expect(screen.getByTestId('verse-action-menu')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Close'));
      expect(
        screen.queryByTestId('verse-action-menu')
      ).not.toBeInTheDocument();
    });

    it('highlights the selected verse with a background class', () => {
      render(
        <BibleViewer
          verses={sampleVerses}
          bookName="Genesis"
          chapter={1}
        />
      );

      const verseSpans = document.querySelectorAll('span.group');
      fireEvent.click(verseSpans[1]);

      // The clicked verse should have the highlight class
      expect(verseSpans[1].className).toContain('bg-yellow-100');
      // Other verses should not
      expect(verseSpans[0].className).not.toContain('bg-yellow-100');
    });
  });

  describe('props defaults', () => {
    it('renders with default version and bookId', () => {
      // Just ensure it doesn't crash with minimal props
      const { container } = render(
        <BibleViewer
          verses={sampleVerses}
          bookName="Genesis"
          chapter={1}
        />
      );
      expect(container.querySelector('article')).toBeInTheDocument();
    });
  });
});

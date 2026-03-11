/**
 * Unit tests for src/components/study/VocabularyStats.tsx
 * Tests total count display, category breakdown, progress bar.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import VocabularyStats from '@/components/study/VocabularyStats';

// Mock the useVocabulary hook
const mockStats = {
  total: 0,
  hebrew: 0,
  greek: 0,
  mastered: 0,
  learning: 0,
};

jest.mock('@/hooks/useVocabulary', () => ({
  useVocabulary: () => ({
    stats: mockStats,
  }),
}));

function setStats(overrides: Partial<typeof mockStats>) {
  Object.assign(mockStats, { total: 0, hebrew: 0, greek: 0, mastered: 0, learning: 0, ...overrides });
}

beforeEach(() => {
  setStats({});
});

describe('VocabularyStats', () => {
  describe('empty state', () => {
    it('returns null when total is 0', () => {
      setStats({ total: 0 });
      const { container } = render(<VocabularyStats />);
      expect(container.innerHTML).toBe('');
    });
  });

  describe('with data', () => {
    beforeEach(() => {
      setStats({ total: 20, hebrew: 12, greek: 8, mastered: 5, learning: 15 });
    });

    it('renders the stats component', () => {
      render(<VocabularyStats />);
      expect(screen.getByText('학습 통계')).toBeInTheDocument();
    });

    it('displays total count', () => {
      render(<VocabularyStats />);
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('전체 단어')).toBeInTheDocument();
    });

    it('displays Hebrew count', () => {
      render(<VocabularyStats />);
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(screen.getByText('히브리어')).toBeInTheDocument();
    });

    it('displays Greek count', () => {
      render(<VocabularyStats />);
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('헬라어')).toBeInTheDocument();
    });

    it('displays mastered count', () => {
      render(<VocabularyStats />);
      expect(screen.getByText('5')).toBeInTheDocument();
      // The "학습완료" label under the count
      expect(screen.getAllByText(/학습완료/).length).toBeGreaterThanOrEqual(1);
    });

    it('displays mastered percentage (25%)', () => {
      render(<VocabularyStats />);
      expect(screen.getByText('25%')).toBeInTheDocument();
    });

    it('displays learning progress text', () => {
      render(<VocabularyStats />);
      expect(screen.getByText(/5\/20 단어 학습완료/)).toBeInTheDocument();
      expect(screen.getByText(/15/)).toBeInTheDocument();
    });
  });

  describe('percentage calculations', () => {
    it('shows 0% when no items are mastered', () => {
      setStats({ total: 10, hebrew: 5, greek: 5, mastered: 0, learning: 10 });
      render(<VocabularyStats />);
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('shows 100% when all items are mastered', () => {
      setStats({ total: 10, hebrew: 5, greek: 5, mastered: 10, learning: 0 });
      render(<VocabularyStats />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('rounds percentage correctly', () => {
      setStats({ total: 3, hebrew: 2, greek: 1, mastered: 1, learning: 2 });
      render(<VocabularyStats />);
      // 1/3 = 33.33... -> rounded to 33%
      expect(screen.getByText('33%')).toBeInTheDocument();
    });
  });

  describe('single item', () => {
    it('displays correctly with a single Hebrew word', () => {
      setStats({ total: 1, hebrew: 1, greek: 0, mastered: 0, learning: 1 });
      render(<VocabularyStats />);
      // Total count "1" appears, but also hebrew "1" so there are multiple "1"s
      // Check that 전체 단어 label is present alongside the count
      expect(screen.getByText('전체 단어')).toBeInTheDocument();
      expect(screen.getByText('히브리어')).toBeInTheDocument();
    });
  });
});

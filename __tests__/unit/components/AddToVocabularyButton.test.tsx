/**
 * Unit tests for src/components/study/AddToVocabularyButton.tsx
 * Tests star icon toggle, add/remove word.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddToVocabularyButton from '@/components/study/AddToVocabularyButton';
import { StrongsEntry } from '@/types/bible';

// Mock the useVocabulary hook
const mockIsInVocabulary = jest.fn();
const mockToggleByStrongsNumber = jest.fn();

jest.mock('@/hooks/useVocabulary', () => ({
  useVocabulary: () => ({
    isInVocabulary: mockIsInVocabulary,
    toggleByStrongsNumber: mockToggleByStrongsNumber,
  }),
}));

const mockEntry: StrongsEntry = {
  number: 'H7225',
  lemma: 'בְּרֵאשִׁית',
  transliteration: "bere'shit",
  pronunciation: 'bay-ray-sheeth',
  definition: 'beginning, chief, first part',
  shortDefinition: 'beginning',
  language: 'hebrew',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AddToVocabularyButton', () => {
  describe('when word is NOT in vocabulary', () => {
    beforeEach(() => {
      mockIsInVocabulary.mockReturnValue(false);
    });

    it('renders a button', () => {
      render(<AddToVocabularyButton entry={mockEntry} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('has aria-label "단어장에 추가"', () => {
      render(<AddToVocabularyButton entry={mockEntry} />);
      expect(screen.getByLabelText('단어장에 추가')).toBeInTheDocument();
    });

    it('renders an unfilled star (no fill-yellow-400 class)', () => {
      render(<AddToVocabularyButton entry={mockEntry} />);
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg!.className.baseVal || svg!.getAttribute('class')).toContain('fill-none');
    });

    it('calls toggleByStrongsNumber on click', () => {
      render(<AddToVocabularyButton entry={mockEntry} />);
      fireEvent.click(screen.getByRole('button'));

      expect(mockToggleByStrongsNumber).toHaveBeenCalledWith(mockEntry);
    });
  });

  describe('when word IS in vocabulary', () => {
    beforeEach(() => {
      mockIsInVocabulary.mockReturnValue(true);
    });

    it('has aria-label "단어장에서 제거"', () => {
      render(<AddToVocabularyButton entry={mockEntry} />);
      expect(screen.getByLabelText('단어장에서 제거')).toBeInTheDocument();
    });

    it('renders a filled star (fill-yellow-400 class)', () => {
      render(<AddToVocabularyButton entry={mockEntry} />);
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg!.className.baseVal || svg!.getAttribute('class')).toContain('fill-yellow-400');
    });

    it('calls toggleByStrongsNumber on click to remove', () => {
      render(<AddToVocabularyButton entry={mockEntry} />);
      fireEvent.click(screen.getByRole('button'));

      expect(mockToggleByStrongsNumber).toHaveBeenCalledWith(mockEntry);
    });
  });

  describe('size prop', () => {
    it('uses small size by default', () => {
      mockIsInVocabulary.mockReturnValue(false);
      render(<AddToVocabularyButton entry={mockEntry} />);
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg!.className.baseVal || svg!.getAttribute('class')).toContain('h-5');
      expect(svg!.className.baseVal || svg!.getAttribute('class')).toContain('w-5');
    });

    it('uses medium size when specified', () => {
      mockIsInVocabulary.mockReturnValue(false);
      render(<AddToVocabularyButton entry={mockEntry} size="md" />);
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg!.className.baseVal || svg!.getAttribute('class')).toContain('h-6');
      expect(svg!.className.baseVal || svg!.getAttribute('class')).toContain('w-6');
    });
  });

  describe('event propagation', () => {
    it('stops propagation on click', () => {
      mockIsInVocabulary.mockReturnValue(false);
      const outerHandler = jest.fn();

      render(
        <div onClick={outerHandler}>
          <AddToVocabularyButton entry={mockEntry} />
        </div>
      );

      fireEvent.click(screen.getByRole('button'));
      expect(outerHandler).not.toHaveBeenCalled();
    });
  });
});

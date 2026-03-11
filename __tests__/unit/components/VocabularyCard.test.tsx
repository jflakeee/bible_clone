/**
 * Unit tests for src/components/study/VocabularyCard.tsx
 * Tests rendering, expand/collapse, notes editing, review toggle.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VocabularyCard from '@/components/study/VocabularyCard';
import { VocabularyItem } from '@/types/vocabulary';

const mockItem: VocabularyItem = {
  id: 'test-1',
  strongsNumber: 'H7225',
  lemma: 'בְּרֵאשִׁית',
  transliteration: "bere'shit",
  definition: 'beginning, chief, first part',
  shortDefinition: 'beginning',
  language: 'hebrew',
  notes: 'First word of the Bible',
  createdAt: '2026-01-01T00:00:00.000Z',
  reviewCount: 3,
  lastReviewedAt: '2026-01-10T00:00:00.000Z',
  mastered: false,
};

const greekItem: VocabularyItem = {
  ...mockItem,
  id: 'test-2',
  strongsNumber: 'G26',
  lemma: '\u03B1\u0313\u03B3\u03AC\u03C0\u03B7',
  transliteration: 'agape',
  definition: 'love, charity',
  shortDefinition: 'love',
  language: 'greek',
  mastered: true,
  notes: '',
  reviewCount: 10,
};

const defaultHandlers = {
  onDelete: jest.fn(),
  onToggleMastered: jest.fn(),
  onReview: jest.fn(),
  onUpdateNotes: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('VocabularyCard', () => {
  describe('rendering', () => {
    it('renders the original word (lemma)', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      expect(screen.getByText('בְּרֵאשִׁית')).toBeInTheDocument();
    });

    it('renders the transliteration', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      expect(screen.getByText("bere'shit")).toBeInTheDocument();
    });

    it('renders the short definition', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      expect(screen.getByText('beginning')).toBeInTheDocument();
    });

    it('renders the Strong number', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      expect(screen.getByText('H7225')).toBeInTheDocument();
    });

    it('renders review count', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('shows Hebrew language badge', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      expect(screen.getByText('히브리어')).toBeInTheDocument();
    });

    it('shows Greek language badge for Greek items', () => {
      render(<VocabularyCard item={greekItem} {...defaultHandlers} />);
      expect(screen.getByText('헬라어')).toBeInTheDocument();
    });

    it('shows mastered badge when mastered is true', () => {
      render(<VocabularyCard item={greekItem} {...defaultHandlers} />);
      expect(screen.getByText('학습완료')).toBeInTheDocument();
    });

    it('does not show mastered badge when mastered is false', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      expect(screen.queryByText('학습완료')).not.toBeInTheDocument();
    });
  });

  describe('expand/collapse', () => {
    it('does not show full definition when collapsed', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      expect(screen.queryByText('beginning, chief, first part')).not.toBeInTheDocument();
    });

    it('shows full definition when expanded', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);

      // Click to expand
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));

      expect(screen.getByText('beginning, chief, first part')).toBeInTheDocument();
    });

    it('shows notes when expanded', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));

      expect(screen.getByText('First word of the Bible')).toBeInTheDocument();
    });

    it('shows "no notes" when notes are empty', () => {
      const noNotesItem = { ...mockItem, notes: '' };
      render(<VocabularyCard item={noNotesItem} {...defaultHandlers} />);
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));

      expect(screen.getByText('메모 없음')).toBeInTheDocument();
    });

    it('shows "no notes" for greek item without notes', () => {
      render(<VocabularyCard item={greekItem} {...defaultHandlers} />);
      // Click the lemma to expand
      fireEvent.click(screen.getByText('\u03B1\u0313\u03B3\u03AC\u03C0\u03B7'));

      expect(screen.getByText('메모 없음')).toBeInTheDocument();
    });

    it('shows action buttons when expanded', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));

      // "복습" appears both as count label and action button
      const reviewButtons = screen.getAllByText('복습');
      expect(reviewButtons.length).toBeGreaterThanOrEqual(2); // label + button
      expect(screen.getByText('학습완료')).toBeInTheDocument();
      expect(screen.getByText('삭제')).toBeInTheDocument();
    });

    it('shows "학습중으로 변경" for mastered items', () => {
      render(<VocabularyCard item={greekItem} {...defaultHandlers} />);
      fireEvent.click(screen.getByText('\u03B1\u0313\u03B3\u03AC\u03C0\u03B7'));

      expect(screen.getByText('학습중으로 변경')).toBeInTheDocument();
    });

    it('collapses when clicked again', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);

      // Expand
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));
      expect(screen.getByText('beginning, chief, first part')).toBeInTheDocument();

      // Collapse
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));
      expect(screen.queryByText('beginning, chief, first part')).not.toBeInTheDocument();
    });
  });

  describe('notes editing', () => {
    it('shows edit button when expanded', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));

      expect(screen.getByText('편집')).toBeInTheDocument();
    });

    it('shows textarea when edit is clicked', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));
      fireEvent.click(screen.getByText('편집'));

      expect(screen.getByPlaceholderText('메모를 입력하세요...')).toBeInTheDocument();
    });

    it('calls onUpdateNotes when saving', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));
      fireEvent.click(screen.getByText('편집'));

      const textarea = screen.getByPlaceholderText('메모를 입력하세요...');
      fireEvent.change(textarea, { target: { value: 'Updated note' } });
      fireEvent.click(screen.getByText('저장'));

      expect(defaultHandlers.onUpdateNotes).toHaveBeenCalledWith('test-1', 'Updated note');
    });

    it('cancels editing and restores original notes', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));
      fireEvent.click(screen.getByText('편집'));

      const textarea = screen.getByPlaceholderText('메모를 입력하세요...');
      fireEvent.change(textarea, { target: { value: 'Changed' } });
      fireEvent.click(screen.getByText('취소'));

      // Should show original notes again, not the changed value
      expect(screen.getByText('First word of the Bible')).toBeInTheDocument();
    });
  });

  describe('actions', () => {
    it('calls onReview when review button clicked', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));

      // "복습" appears as both label and button; find the button in the actions area
      const reviewButtons = screen.getAllByText('복습');
      // The action button is the one inside the border-t area (last one)
      fireEvent.click(reviewButtons[reviewButtons.length - 1]);

      expect(defaultHandlers.onReview).toHaveBeenCalledWith('test-1');
    });

    it('calls onToggleMastered when mastered button clicked', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));
      fireEvent.click(screen.getByText('학습완료'));

      expect(defaultHandlers.onToggleMastered).toHaveBeenCalledWith('test-1');
    });

    it('shows delete confirmation on first click', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));
      fireEvent.click(screen.getByText('삭제'));

      expect(screen.getByText('정말 삭제하시겠습니까?')).toBeInTheDocument();
      expect(defaultHandlers.onDelete).not.toHaveBeenCalled();
    });

    it('calls onDelete on second click (confirmation)', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));
      fireEvent.click(screen.getByText('삭제'));
      fireEvent.click(screen.getByText('정말 삭제하시겠습니까?'));

      expect(defaultHandlers.onDelete).toHaveBeenCalledWith('test-1');
    });

    it('cancels delete confirmation', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));
      fireEvent.click(screen.getByText('삭제'));

      // Cancel button appears
      const cancelButtons = screen.getAllByText('취소');
      fireEvent.click(cancelButtons[cancelButtons.length - 1]);

      // Should revert to normal delete button
      expect(screen.getByText('삭제')).toBeInTheDocument();
      expect(screen.queryByText('정말 삭제하시겠습니까?')).not.toBeInTheDocument();
    });
  });

  describe('last reviewed date', () => {
    it('shows last reviewed date when expanded and date exists', () => {
      render(<VocabularyCard item={mockItem} {...defaultHandlers} />);
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));

      expect(screen.getByText(/마지막 복습/)).toBeInTheDocument();
    });

    it('does not show last reviewed date when null', () => {
      const item = { ...mockItem, lastReviewedAt: null };
      render(<VocabularyCard item={item} {...defaultHandlers} />);
      fireEvent.click(screen.getByText('בְּרֵאשִׁית'));

      expect(screen.queryByText(/마지막 복습/)).not.toBeInTheDocument();
    });
  });
});

/**
 * Unit tests for src/components/bible/StrongsPopover.tsx
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StrongsPopover from '@/components/bible/StrongsPopover';
import { StrongsEntry } from '@/types/bible';

const hebrewEntry: StrongsEntry = {
  number: 'H1',
  lemma: '\u05d0\u05b8\u05d1',
  transliteration: "'ab",
  pronunciation: 'awb',
  definition: 'a primitive word father',
  shortDefinition: 'chief, (fore-)father(-less)',
  language: 'hebrew',
};

const greekEntry: StrongsEntry = {
  number: 'G26',
  lemma: '\u03b1\u0313\u03b3\u03b1\u0301\u03c0\u03b7',
  transliteration: 'agape',
  pronunciation: '',
  definition: 'from G25 love, i.e. affection or benevolence',
  shortDefinition: 'charity, dear, love',
  language: 'greek',
};

const defaultProps = {
  entry: null as StrongsEntry | null,
  loading: false,
  error: null as string | null,
  anchorRect: null as DOMRect | null,
  onClose: jest.fn(),
};

describe('StrongsPopover', () => {
  beforeEach(() => {
    defaultProps.onClose = jest.fn();
  });

  // ─── Render nothing when no data ──────────────────────────────────

  it('should render nothing when no entry, not loading, and no error', () => {
    const { container } = render(<StrongsPopover {...defaultProps} />);
    expect(container.innerHTML).toBe('');
  });

  // ─── Loading State ────────────────────────────────────────────────

  it('should show loading spinner when loading', () => {
    render(<StrongsPopover {...defaultProps} loading={true} />);
    expect(screen.getByText(/Loading Strong.*entry/)).toBeInTheDocument();
  });

  // ─── Error State ──────────────────────────────────────────────────

  it('should display error message', () => {
    render(
      <StrongsPopover {...defaultProps} error="Something went wrong" />
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  // ─── Hebrew Entry Rendering ───────────────────────────────────────

  it('should render Strong\'s number', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    expect(screen.getByText('H1')).toBeInTheDocument();
  });

  it('should display language label as Hebrew', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    expect(screen.getByText('Hebrew')).toBeInTheDocument();
  });

  it('should render Hebrew lemma', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    expect(screen.getByText('\u05d0\u05b8\u05d1')).toBeInTheDocument();
  });

  it('should apply RTL direction for Hebrew lemma', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    const lemmaEl = screen.getByText('\u05d0\u05b8\u05d1');
    expect(lemmaEl).toHaveStyle({ direction: 'rtl' });
  });

  it('should display transliteration', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    expect(screen.getByText("'ab")).toBeInTheDocument();
  });

  it('should display pronunciation', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    expect(screen.getByText('awb')).toBeInTheDocument();
  });

  it('should display definition', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    expect(
      screen.getByText('a primitive word father')
    ).toBeInTheDocument();
  });

  it('should display KJV short definition', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    expect(
      screen.getByText('chief, (fore-)father(-less)')
    ).toBeInTheDocument();
  });

  // ─── Greek Entry Rendering ────────────────────────────────────────

  it('should display language label as Greek', () => {
    render(<StrongsPopover {...defaultProps} entry={greekEntry} />);
    expect(screen.getByText('Greek')).toBeInTheDocument();
  });

  it('should apply LTR direction for Greek lemma', () => {
    render(<StrongsPopover {...defaultProps} entry={greekEntry} />);
    const lemmaEl = screen.getByText(greekEntry.lemma);
    expect(lemmaEl).toHaveStyle({ direction: 'ltr' });
  });

  it('should render Greek transliteration', () => {
    render(<StrongsPopover {...defaultProps} entry={greekEntry} />);
    expect(screen.getByText('agape')).toBeInTheDocument();
  });

  // ─── Close Button ─────────────────────────────────────────────────

  it('should have a close button with aria-label', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    const closeBtn = screen.getByRole('button', { name: /close/i });
    expect(closeBtn).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  // ─── Close on Escape Key ──────────────────────────────────────────

  it('should call onClose when Escape key is pressed', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose for non-Escape keys', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  // ─── Close on Backdrop Click ──────────────────────────────────────

  it('should call onClose when backdrop is clicked', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    // The backdrop is the first child with onClick={onClose}
    const backdrop = document.querySelector('.fixed.inset-0');
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop!);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  // ─── Close on Click Outside ───────────────────────────────────────

  it('should call onClose when clicking outside the popover', () => {
    render(
      <div>
        <div data-testid="outside">outside</div>
        <StrongsPopover {...defaultProps} entry={hebrewEntry} />
      </div>
    );
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  // ─── Sections Visibility ──────────────────────────────────────────

  it('should show "Definition" heading', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    expect(screen.getByText('Definition')).toBeInTheDocument();
  });

  it('should show "KJV Usage" heading', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    expect(screen.getByText('KJV Usage')).toBeInTheDocument();
  });

  it('should show "Transliteration:" label', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    expect(screen.getByText(/Transliteration:/)).toBeInTheDocument();
  });

  it('should show "Pronunciation:" label', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    expect(screen.getByText(/Pronunciation:/)).toBeInTheDocument();
  });

  // ─── Entry with missing optional fields ───────────────────────────

  it('should not render pronunciation section when empty', () => {
    render(<StrongsPopover {...defaultProps} entry={greekEntry} />);
    expect(screen.queryByText(/Pronunciation:/)).not.toBeInTheDocument();
  });

  it('should not render lemma section when empty', () => {
    const noLemma: StrongsEntry = { ...hebrewEntry, lemma: '' };
    render(<StrongsPopover {...defaultProps} entry={noLemma} />);
    // The lemma text element should not be present
    expect(screen.queryByText('\u05d0\u05b8\u05d1')).not.toBeInTheDocument();
  });

  // ─── Positioning ──────────────────────────────────────────────────

  it('should apply centered positioning when no anchorRect', () => {
    render(<StrongsPopover {...defaultProps} entry={hebrewEntry} />);
    // Popover should have transform: translate(-50%, -50%)
    const popover = document.querySelector('[class*="rounded-xl"]');
    expect(popover).toHaveStyle({ transform: 'translate(-50%, -50%)' });
  });
});

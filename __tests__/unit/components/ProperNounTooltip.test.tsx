import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProperNounTooltip from '@/components/bible/ProperNounTooltip';
import type { ProperNoun } from '@/lib/proper-nouns';

const sampleNoun: ProperNoun = {
  id: 'abraham',
  original: 'אַבְרָהָם',
  english: 'Abraham',
  korean: '아브라함',
  type: 'person',
  description: 'Father of the Jewish nation, called by God from Ur.',
  descriptionKo: '유대 민족의 조상, 하나님께서 우르에서 부르신 사람.',
  strongsNumber: 'H85',
  occurrences: 175,
};

const placeNoun: ProperNoun = {
  id: 'jerusalem',
  original: 'יְרוּשָׁלַיִם',
  english: 'Jerusalem',
  korean: '예루살렘',
  type: 'place',
  description: 'Holy city, capital of Israel.',
  descriptionKo: '거룩한 도시, 이스라엘의 수도.',
  strongsNumber: 'H3389',
  occurrences: 660,
};

const anchorRect = new DOMRect(100, 200, 80, 20);

describe('ProperNounTooltip', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  describe('content rendering', () => {
    it('shows Korean name', () => {
      render(<ProperNounTooltip noun={sampleNoun} anchorRect={anchorRect} onClose={onClose} />);
      expect(screen.getByText('아브라함')).toBeInTheDocument();
    });

    it('shows English name', () => {
      render(<ProperNounTooltip noun={sampleNoun} anchorRect={anchorRect} onClose={onClose} />);
      expect(screen.getByText('Abraham')).toBeInTheDocument();
    });

    it('shows original script', () => {
      render(<ProperNounTooltip noun={sampleNoun} anchorRect={anchorRect} onClose={onClose} />);
      expect(screen.getByText('אַבְרָהָם')).toBeInTheDocument();
    });

    it('shows type label in Korean (인물)', () => {
      render(<ProperNounTooltip noun={sampleNoun} anchorRect={anchorRect} onClose={onClose} />);
      expect(screen.getByText('인물')).toBeInTheDocument();
    });

    it('shows type label for place (장소)', () => {
      render(<ProperNounTooltip noun={placeNoun} anchorRect={anchorRect} onClose={onClose} />);
      expect(screen.getByText('장소')).toBeInTheDocument();
    });

    it('shows Korean description', () => {
      render(<ProperNounTooltip noun={sampleNoun} anchorRect={anchorRect} onClose={onClose} />);
      expect(screen.getByText(sampleNoun.descriptionKo)).toBeInTheDocument();
    });

    it('shows English description', () => {
      render(<ProperNounTooltip noun={sampleNoun} anchorRect={anchorRect} onClose={onClose} />);
      expect(screen.getByText(sampleNoun.description)).toBeInTheDocument();
    });

    it('shows Strongs number', () => {
      render(<ProperNounTooltip noun={sampleNoun} anchorRect={anchorRect} onClose={onClose} />);
      expect(screen.getByText("Strong's H85")).toBeInTheDocument();
    });

    it('shows occurrence count', () => {
      render(<ProperNounTooltip noun={sampleNoun} anchorRect={anchorRect} onClose={onClose} />);
      expect(screen.getByText(/175회/)).toBeInTheDocument();
    });

    it('shows map link for place type', () => {
      render(<ProperNounTooltip noun={placeNoun} anchorRect={anchorRect} onClose={onClose} />);
      expect(screen.getByText('지도 보기')).toBeInTheDocument();
    });

    it('does not show map link for person type', () => {
      render(<ProperNounTooltip noun={sampleNoun} anchorRect={anchorRect} onClose={onClose} />);
      expect(screen.queryByText('지도 보기')).not.toBeInTheDocument();
    });
  });

  describe('close behavior', () => {
    it('calls onClose when close button clicked', () => {
      render(<ProperNounTooltip noun={sampleNoun} anchorRect={anchorRect} onClose={onClose} />);
      fireEvent.click(screen.getByLabelText('Close'));
      expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when backdrop clicked', () => {
      const { container } = render(
        <ProperNounTooltip noun={sampleNoun} anchorRect={anchorRect} onClose={onClose} />
      );
      // Backdrop is the fixed inset-0 div
      const backdrop = container.querySelector('.fixed.inset-0');
      expect(backdrop).toBeTruthy();
      fireEvent.click(backdrop!);
      expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose on Escape key', () => {
      render(<ProperNounTooltip noun={sampleNoun} anchorRect={anchorRect} onClose={onClose} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose on click outside tooltip', () => {
      render(<ProperNounTooltip noun={sampleNoun} anchorRect={anchorRect} onClose={onClose} />);
      fireEvent.mouseDown(document);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('positioning', () => {
    it('positions below the anchor element', () => {
      const { container } = render(
        <ProperNounTooltip noun={sampleNoun} anchorRect={anchorRect} onClose={onClose} />
      );
      // The tooltip card (second child, after backdrop)
      const cards = container.querySelectorAll('[style]');
      const tooltipCard = Array.from(cards).find(
        (el) => (el as HTMLElement).style.top !== ''
      );
      expect(tooltipCard).toBeTruthy();
    });

    it('handles null anchorRect gracefully', () => {
      const { container } = render(
        <ProperNounTooltip noun={sampleNoun} anchorRect={null} onClose={onClose} />
      );
      // Should render centered (transform: translate)
      expect(container.querySelector('[style]')).toBeTruthy();
    });
  });

  describe('noun without Strongs number', () => {
    it('does not show Strongs badge', () => {
      const nounNoStrongs = { ...sampleNoun, strongsNumber: undefined };
      render(<ProperNounTooltip noun={nounNoStrongs} anchorRect={anchorRect} onClose={onClose} />);
      expect(screen.queryByText(/Strong's/)).not.toBeInTheDocument();
    });
  });
});

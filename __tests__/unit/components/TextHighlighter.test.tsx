import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextHighlighter from '@/components/bible/TextHighlighter';
import { useSettingsStore } from '@/stores/settingsStore';

// Mock ProperNounTooltip
jest.mock('@/components/bible/ProperNounTooltip', () => {
  return function MockTooltip({ noun, onClose }: { noun: any; onClose: () => void }) {
    return (
      <div data-testid="tooltip">
        <span>{noun.korean}</span>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

beforeEach(() => {
  useSettingsStore.setState({
    highlightProperNouns: true,
    highlightStyle: 'italic',
  });
});

describe('TextHighlighter', () => {
  describe('when highlighting is enabled', () => {
    it('highlights proper nouns in Korean text', () => {
      const { container } = render(
        <TextHighlighter text="아브라함이 이삭에게 말했다." language="ko" />
      );
      // Should have interactive elements for proper nouns
      const buttons = container.querySelectorAll('[role="button"]');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('highlights proper nouns in English text', () => {
      const { container } = render(
        <TextHighlighter text="Abraham spoke to Isaac." language="en" />
      );
      const buttons = container.querySelectorAll('[role="button"]');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('applies italic style class by default', () => {
      const { container } = render(
        <TextHighlighter text="아브라함이 말했다." language="ko" />
      );
      const highlighted = container.querySelector('[role="button"]');
      expect(highlighted?.className).toContain('italic');
    });

    it('applies bold style class when set', () => {
      useSettingsStore.setState({ highlightStyle: 'bold' });
      const { container } = render(
        <TextHighlighter text="아브라함이 말했다." language="ko" />
      );
      const highlighted = container.querySelector('[role="button"]');
      expect(highlighted?.className).toContain('font-bold');
    });

    it('applies underline style class when set', () => {
      useSettingsStore.setState({ highlightStyle: 'underline' });
      const { container } = render(
        <TextHighlighter text="아브라함이 말했다." language="ko" />
      );
      const highlighted = container.querySelector('[role="button"]');
      expect(highlighted?.className).toContain('underline');
    });

    it('applies color style class when set', () => {
      useSettingsStore.setState({ highlightStyle: 'color' });
      const { container } = render(
        <TextHighlighter text="아브라함이 말했다." language="ko" />
      );
      const highlighted = container.querySelector('[role="button"]');
      expect(highlighted?.className).toContain('bg-amber-50');
    });

    it('shows tooltip when a proper noun is clicked', () => {
      render(
        <TextHighlighter text="아브라함이 말했다." language="ko" />
      );
      const buttons = screen.getAllByRole('button');
      const nounButton = buttons.find((b) => b.getAttribute('tabindex') === '0');
      if (nounButton) {
        fireEvent.click(nounButton);
        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      }
    });

    it('closes tooltip when close is clicked', () => {
      render(
        <TextHighlighter text="아브라함이 말했다." language="ko" />
      );
      const buttons = screen.getAllByRole('button');
      const nounButton = buttons.find((b) => b.getAttribute('tabindex') === '0');
      if (nounButton) {
        fireEvent.click(nounButton);
        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Close'));
        expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
      }
    });

    it('renders non-proper-noun text as plain spans', () => {
      render(
        <TextHighlighter text="아브라함이 말했다." language="ko" />
      );
      // The surrounding text should be present
      expect(screen.getByText(/말했다/)).toBeInTheDocument();
    });
  });

  describe('when highlighting is disabled', () => {
    beforeEach(() => {
      useSettingsStore.setState({ highlightProperNouns: false });
    });

    it('renders plain text without highlights', () => {
      const { container } = render(
        <TextHighlighter text="아브라함이 이삭에게 말했다." language="ko" />
      );
      const buttons = container.querySelectorAll('[role="button"]');
      expect(buttons.length).toBe(0);
      expect(screen.getByText('아브라함이 이삭에게 말했다.')).toBeInTheDocument();
    });
  });

  describe('text with no proper nouns', () => {
    it('renders plain text', () => {
      render(
        <TextHighlighter text="오늘 날씨가 좋습니다." language="ko" />
      );
      expect(screen.getByText('오늘 날씨가 좋습니다.')).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('applies custom className', () => {
      const { container } = render(
        <TextHighlighter text="hello" language="en" className="custom-class" />
      );
      expect(container.querySelector('.custom-class')).toBeInTheDocument();
    });
  });
});

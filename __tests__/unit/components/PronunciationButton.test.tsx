/**
 * Unit tests for src/components/audio/PronunciationButton.tsx
 * Tests rendering and click triggering speech.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PronunciationButton from '@/components/audio/PronunciationButton';

// Mock the tts-service module
jest.mock('@/lib/tts-service', () => ({
  speakText: jest.fn(),
}));

// Mock Web Speech API
const mockSpeak = jest.fn();
const mockCancel = jest.fn();

beforeAll(() => {
  (global as unknown as Record<string, unknown>).SpeechSynthesisUtterance = jest.fn().mockImplementation((text: string) => ({
    text,
    lang: '',
    rate: 1,
    onstart: null,
    onend: null,
    onerror: null,
  }));

  Object.defineProperty(window, 'speechSynthesis', {
    value: {
      speak: mockSpeak,
      cancel: mockCancel,
    },
    writable: true,
    configurable: true,
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PronunciationButton', () => {
  describe('rendering', () => {
    it('renders a button element', () => {
      render(<PronunciationButton text="하나님" />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('has correct aria-label for pronunciation', () => {
      render(<PronunciationButton text="하나님" />);
      expect(screen.getByLabelText('Pronounce 하나님')).toBeInTheDocument();
    });

    it('has title "발음 듣기" when not playing', () => {
      render(<PronunciationButton text="하나님" />);
      expect(screen.getByTitle('발음 듣기')).toBeInTheDocument();
    });

    it('renders with small size by default', () => {
      render(<PronunciationButton text="test" />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-6');
      expect(button.className).toContain('w-6');
    });

    it('renders with medium size when specified', () => {
      render(<PronunciationButton text="test" size="md" />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('h-8');
      expect(button.className).toContain('w-8');
    });

    it('applies custom className', () => {
      render(<PronunciationButton text="test" className="custom-class" />);
      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
    });
  });

  describe('click behavior', () => {
    it('calls speechSynthesis.cancel and then speak on click', () => {
      render(<PronunciationButton text="하나님" />);
      fireEvent.click(screen.getByRole('button'));

      expect(mockCancel).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalled();
    });

    it('creates SpeechSynthesisUtterance with the correct text', () => {
      render(<PronunciationButton text="하나님" />);
      fireEvent.click(screen.getByRole('button'));

      expect((global as unknown as Record<string, jest.Mock>).SpeechSynthesisUtterance).toHaveBeenCalledWith('하나님');
    });

    it('uses default language ko-KR', () => {
      render(<PronunciationButton text="test" />);
      fireEvent.click(screen.getByRole('button'));

      const utteranceInstance = (global as unknown as Record<string, jest.Mock>).SpeechSynthesisUtterance.mock.results[0].value;
      expect(utteranceInstance.lang).toBe('ko-KR');
    });

    it('uses specified language', () => {
      render(<PronunciationButton text="logos" language="el-GR" />);
      fireEvent.click(screen.getByRole('button'));

      const utteranceInstance = (global as unknown as Record<string, jest.Mock>).SpeechSynthesisUtterance.mock.results[0].value;
      expect(utteranceInstance.lang).toBe('el-GR');
    });

    it('sets rate to 1.0', () => {
      render(<PronunciationButton text="test" />);
      fireEvent.click(screen.getByRole('button'));

      const utteranceInstance = (global as unknown as Record<string, jest.Mock>).SpeechSynthesisUtterance.mock.results[0].value;
      expect(utteranceInstance.rate).toBe(1.0);
    });
  });
});

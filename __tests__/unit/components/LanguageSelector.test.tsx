import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSelector, { LANGUAGES } from '@/components/audio/LanguageSelector';

describe('LanguageSelector', () => {
  const onSelect = jest.fn();

  beforeEach(() => {
    onSelect.mockClear();
  });

  describe('full mode (default)', () => {
    it('renders 9 language buttons', () => {
      const { container } = render(<LanguageSelector selectedLanguage="ko-KR" onSelect={onSelect} />);
      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(9);
    });

    it('renders at least 9 languages', () => {
      expect(LANGUAGES.length).toBeGreaterThanOrEqual(9);
    });

    it('renders native names', () => {
      render(<LanguageSelector selectedLanguage="ko-KR" onSelect={onSelect} />);
      // 한국어 appears twice (nameKo and nameNative are the same), so use getAllByText
      expect(screen.getAllByText('한국어').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('日本語')).toBeInTheDocument();
    });

    it('shows heading text', () => {
      render(<LanguageSelector selectedLanguage="ko-KR" onSelect={onSelect} />);
      expect(screen.getByText('음성 언어 선택')).toBeInTheDocument();
    });

    it('calls onSelect when a language is clicked', () => {
      render(<LanguageSelector selectedLanguage="ko-KR" onSelect={onSelect} />);
      // Click on English button
      fireEvent.click(screen.getByText('영어'));
      expect(onSelect).toHaveBeenCalledWith('en-US');
    });

    it('calls onSelect with correct code for Japanese', () => {
      render(<LanguageSelector selectedLanguage="ko-KR" onSelect={onSelect} />);
      fireEvent.click(screen.getByText('일본어'));
      expect(onSelect).toHaveBeenCalledWith('ja-JP');
    });

    it('highlights the selected language', () => {
      const { container } = render(
        <LanguageSelector selectedLanguage="en-US" onSelect={onSelect} />
      );
      // The selected button should have the blue border class
      const buttons = container.querySelectorAll('button');
      const enButton = Array.from(buttons).find((btn) =>
        btn.textContent?.includes('영어')
      );
      expect(enButton?.className).toContain('border-blue-500');
    });
  });

  describe('compact mode', () => {
    it('renders a select element', () => {
      render(
        <LanguageSelector selectedLanguage="ko-KR" onSelect={onSelect} compact />
      );
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('has 9 options', () => {
      render(
        <LanguageSelector selectedLanguage="ko-KR" onSelect={onSelect} compact />
      );
      const options = screen.getAllByRole('option');
      expect(options.length).toBe(9);
    });

    it('calls onSelect on change', () => {
      render(
        <LanguageSelector selectedLanguage="ko-KR" onSelect={onSelect} compact />
      );
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'ja-JP' } });
      expect(onSelect).toHaveBeenCalledWith('ja-JP');
    });
  });
});

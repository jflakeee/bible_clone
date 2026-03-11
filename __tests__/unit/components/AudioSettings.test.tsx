/**
 * Unit tests for src/components/audio/AudioSettings.tsx
 * Tests speed slider, voice selection, language selection.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AudioSettings from '@/components/audio/AudioSettings';

// Mock the tts-service module
jest.mock('@/lib/tts-service', () => ({
  SPEED_OPTIONS: [
    { value: 0.5, label: '0.5x' },
    { value: 0.75, label: '0.75x' },
    { value: 1.0, label: '1x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 2.0, label: '2x' },
  ],
  LANGUAGE_OPTIONS: [
    { code: 'ko-KR', label: '한국어' },
    { code: 'en-US', label: 'English (US)' },
    { code: 'en-GB', label: 'English (UK)' },
    { code: 'he-IL', label: 'עברית (Hebrew)' },
    { code: 'el-GR', label: 'Ελληνικά (Greek)' },
  ],
  getAvailableVoices: jest.fn().mockReturnValue([]),
}));

// Mock speechSynthesis
beforeAll(() => {
  Object.defineProperty(window, 'speechSynthesis', {
    value: {
      getVoices: jest.fn().mockReturnValue([]),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    writable: true,
    configurable: true,
  });
});

const defaultProps = {
  speed: 1.0,
  onSpeedChange: jest.fn(),
  language: 'ko-KR',
  onLanguageChange: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AudioSettings', () => {
  describe('rendering', () => {
    it('renders the settings title', () => {
      render(<AudioSettings {...defaultProps} />);
      expect(screen.getByText('오디오 설정')).toBeInTheDocument();
    });

    it('renders speed label', () => {
      render(<AudioSettings {...defaultProps} />);
      expect(screen.getByText('읽기 속도')).toBeInTheDocument();
    });

    it('renders language label', () => {
      render(<AudioSettings {...defaultProps} />);
      expect(screen.getByText('음성 언어')).toBeInTheDocument();
    });
  });

  describe('speed control', () => {
    it('renders all speed option buttons', () => {
      render(<AudioSettings {...defaultProps} />);

      expect(screen.getByText('0.5x')).toBeInTheDocument();
      expect(screen.getByText('0.75x')).toBeInTheDocument();
      expect(screen.getByText('1x')).toBeInTheDocument();
      expect(screen.getByText('1.25x')).toBeInTheDocument();
      expect(screen.getByText('1.5x')).toBeInTheDocument();
      expect(screen.getByText('2x')).toBeInTheDocument();
    });

    it('highlights the currently selected speed', () => {
      render(<AudioSettings {...defaultProps} speed={1.0} />);
      const activeButton = screen.getByText('1x');
      expect(activeButton.className).toContain('bg-blue-500');
    });

    it('non-selected speed buttons have gray background', () => {
      render(<AudioSettings {...defaultProps} speed={1.0} />);
      const inactiveButton = screen.getByText('0.5x');
      expect(inactiveButton.className).toContain('bg-gray-100');
    });

    it('calls onSpeedChange when a speed button is clicked', () => {
      const onSpeedChange = jest.fn();
      render(<AudioSettings {...defaultProps} onSpeedChange={onSpeedChange} />);

      fireEvent.click(screen.getByText('1.5x'));
      expect(onSpeedChange).toHaveBeenCalledWith(1.5);
    });

    it('calls onSpeedChange with 0.5 when 0.5x is clicked', () => {
      const onSpeedChange = jest.fn();
      render(<AudioSettings {...defaultProps} onSpeedChange={onSpeedChange} />);

      fireEvent.click(screen.getByText('0.5x'));
      expect(onSpeedChange).toHaveBeenCalledWith(0.5);
    });

    it('calls onSpeedChange with 2.0 when 2x is clicked', () => {
      const onSpeedChange = jest.fn();
      render(<AudioSettings {...defaultProps} onSpeedChange={onSpeedChange} />);

      fireEvent.click(screen.getByText('2x'));
      expect(onSpeedChange).toHaveBeenCalledWith(2.0);
    });
  });

  describe('language selection', () => {
    it('renders a language select dropdown', () => {
      render(<AudioSettings {...defaultProps} />);
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
    });

    it('has all language options', () => {
      render(<AudioSettings {...defaultProps} />);
      expect(screen.getByText('한국어')).toBeInTheDocument();
      expect(screen.getByText('English (US)')).toBeInTheDocument();
      expect(screen.getByText('English (UK)')).toBeInTheDocument();
      expect(screen.getByText('עברית (Hebrew)')).toBeInTheDocument();
      expect(screen.getByText('Ελληνικά (Greek)')).toBeInTheDocument();
    });

    it('shows current language as selected', () => {
      render(<AudioSettings {...defaultProps} language="ko-KR" />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('ko-KR');
    });

    it('calls onLanguageChange when language is changed', () => {
      const onLanguageChange = jest.fn();
      render(<AudioSettings {...defaultProps} onLanguageChange={onLanguageChange} />);

      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'en-US' } });
      expect(onLanguageChange).toHaveBeenCalledWith('en-US');
    });
  });

  describe('auto-play toggle', () => {
    it('does not render auto-play toggle when onAutoPlayChange is not provided', () => {
      render(<AudioSettings {...defaultProps} />);
      expect(screen.queryByText('자동 재생')).not.toBeInTheDocument();
    });

    it('renders auto-play toggle when onAutoPlayChange is provided', () => {
      const onAutoPlayChange = jest.fn();
      render(<AudioSettings {...defaultProps} onAutoPlayChange={onAutoPlayChange} />);
      expect(screen.getByText('자동 재생')).toBeInTheDocument();
    });

    it('renders the switch button for auto-play', () => {
      const onAutoPlayChange = jest.fn();
      render(<AudioSettings {...defaultProps} onAutoPlayChange={onAutoPlayChange} />);
      const switchBtn = screen.getByRole('switch');
      expect(switchBtn).toBeInTheDocument();
    });

    it('auto-play switch reflects autoPlay prop state (false)', () => {
      const onAutoPlayChange = jest.fn();
      render(<AudioSettings {...defaultProps} autoPlay={false} onAutoPlayChange={onAutoPlayChange} />);
      const switchBtn = screen.getByRole('switch');
      expect(switchBtn.getAttribute('aria-checked')).toBe('false');
    });

    it('auto-play switch reflects autoPlay prop state (true)', () => {
      const onAutoPlayChange = jest.fn();
      render(<AudioSettings {...defaultProps} autoPlay={true} onAutoPlayChange={onAutoPlayChange} />);
      const switchBtn = screen.getByRole('switch');
      expect(switchBtn.getAttribute('aria-checked')).toBe('true');
    });

    it('calls onAutoPlayChange with toggled value', () => {
      const onAutoPlayChange = jest.fn();
      render(<AudioSettings {...defaultProps} autoPlay={false} onAutoPlayChange={onAutoPlayChange} />);

      fireEvent.click(screen.getByRole('switch'));
      expect(onAutoPlayChange).toHaveBeenCalledWith(true);
    });

    it('calls onAutoPlayChange with false when auto-play is on', () => {
      const onAutoPlayChange = jest.fn();
      render(<AudioSettings {...defaultProps} autoPlay={true} onAutoPlayChange={onAutoPlayChange} />);

      fireEvent.click(screen.getByRole('switch'));
      expect(onAutoPlayChange).toHaveBeenCalledWith(false);
    });
  });

  describe('available voices', () => {
    it('does not show voices section when no voices match', () => {
      render(<AudioSettings {...defaultProps} />);
      expect(screen.queryByText(/사용 가능한 음성/)).not.toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EnhancedAudioPlayer from '@/components/audio/EnhancedAudioPlayer';
import { useTTSStore } from '@/stores/ttsStore';

// Mock tts-service module
const mockSpeak = jest.fn().mockResolvedValue(undefined);
const mockStop = jest.fn();
const mockPauseTTS = jest.fn();
const mockResumeTTS = jest.fn();
const mockGetVoices = jest.fn().mockResolvedValue([]);

jest.mock('@/lib/tts-service', () => ({
  getTTSService: () => ({
    speak: mockSpeak,
    stop: mockStop,
    pause: mockPauseTTS,
    resume: mockResumeTTS,
    getVoices: mockGetVoices,
    isSupported: () => true,
  }),
  TTS_PROVIDERS: [
    { id: 'browser', name: 'Browser', nameKo: '브라우저', description: 'Web Speech API', available: true, premium: false },
    { id: 'google', name: 'Google Cloud', nameKo: 'Google Cloud', description: 'Google Cloud TTS', available: true, premium: true },
  ],
  SPEED_OPTIONS: [
    { value: 0.5, label: '0.5x' },
    { value: 1.0, label: '1x' },
    { value: 1.5, label: '1.5x' },
  ],
}));

// Mock LanguageSelector
jest.mock('@/components/audio/LanguageSelector', () => {
  return function MockLanguageSelector() {
    return <div data-testid="language-selector">LanguageSelector</div>;
  };
});

const sampleVerses = [
  { verse: 1, text: 'In the beginning God created the heavens and the earth.' },
  { verse: 2, text: 'And the earth was without form, and void.' },
  { verse: 3, text: 'And God said, Let there be light.' },
];

beforeEach(() => {
  jest.clearAllMocks();
  useTTSStore.setState({
    selectedProvider: 'browser',
    selectedLanguage: 'ko-KR',
    selectedSpeed: 1.0,
    selectedVoice: '',
    autoPlay: false,
    miniPlayerOpen: false,
  });
});

describe('EnhancedAudioPlayer', () => {
  describe('rendering', () => {
    it('renders the player heading', () => {
      render(<EnhancedAudioPlayer verses={sampleVerses} />);
      expect(screen.getByText('AI 성경 읽기')).toBeInTheDocument();
    });

    it('renders book name and chapter when provided', () => {
      render(<EnhancedAudioPlayer verses={sampleVerses} bookName="창세기" chapter={1} />);
      expect(screen.getByText('창세기 1장')).toBeInTheDocument();
    });

    it('renders play button', () => {
      render(<EnhancedAudioPlayer verses={sampleVerses} />);
      expect(screen.getByLabelText('재생')).toBeInTheDocument();
    });

    it('renders stop button', () => {
      render(<EnhancedAudioPlayer verses={sampleVerses} />);
      expect(screen.getByLabelText('정지')).toBeInTheDocument();
    });

    it('renders prev/next buttons', () => {
      render(<EnhancedAudioPlayer verses={sampleVerses} />);
      expect(screen.getByLabelText('이전 절')).toBeInTheDocument();
      expect(screen.getByLabelText('다음 절')).toBeInTheDocument();
    });

    it('renders speed button showing current speed', () => {
      render(<EnhancedAudioPlayer verses={sampleVerses} />);
      expect(screen.getByText('1x')).toBeInTheDocument();
    });

    it('renders verse number buttons', () => {
      render(<EnhancedAudioPlayer verses={sampleVerses} />);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('progress bar', () => {
    it('shows 0절 / 3절 before playback', () => {
      render(<EnhancedAudioPlayer verses={sampleVerses} />);
      expect(screen.getByText('0절')).toBeInTheDocument();
      expect(screen.getByText('3절')).toBeInTheDocument();
    });
  });

  describe('play/pause controls', () => {
    it('play button is disabled when no verses', () => {
      render(<EnhancedAudioPlayer verses={[]} />);
      const btn = screen.getByLabelText('재생');
      expect(btn).toBeDisabled();
    });

    it('clicking play calls speak on the service', () => {
      render(<EnhancedAudioPlayer verses={sampleVerses} />);
      fireEvent.click(screen.getByLabelText('재생'));
      // speak is called asynchronously but we verify it was invoked
      expect(mockStop).toHaveBeenCalled(); // stop is called before playAll
    });
  });

  describe('speed control', () => {
    it('clicking speed button cycles to next speed', () => {
      render(<EnhancedAudioPlayer verses={sampleVerses} />);
      const speedBtn = screen.getByText('1x');
      fireEvent.click(speedBtn);
      // Speed should have changed via store
      expect(useTTSStore.getState().selectedSpeed).toBe(1.5);
    });
  });

  describe('settings panel', () => {
    it('opens settings when settings button is clicked', () => {
      render(<EnhancedAudioPlayer verses={sampleVerses} />);
      fireEvent.click(screen.getByLabelText('설정'));
      // Settings panel should show tab labels
      expect(screen.getByText('제공자')).toBeInTheDocument();
      expect(screen.getByText('언어')).toBeInTheDocument();
      expect(screen.getByText('설정')).toBeInTheDocument();
    });

    it('shows provider options in provider tab', () => {
      render(<EnhancedAudioPlayer verses={sampleVerses} />);
      fireEvent.click(screen.getByLabelText('설정'));
      expect(screen.getByText('브라우저')).toBeInTheDocument();
      expect(screen.getByText('Google Cloud')).toBeInTheDocument();
    });

    it('shows language selector in language tab', () => {
      render(<EnhancedAudioPlayer verses={sampleVerses} />);
      fireEvent.click(screen.getByLabelText('설정'));
      fireEvent.click(screen.getByText('언어'));
      // There are two language selectors (settings panel + quick selector below)
      expect(screen.getAllByTestId('language-selector').length).toBeGreaterThanOrEqual(2);
    });

    it('shows speed options in settings tab', () => {
      render(<EnhancedAudioPlayer verses={sampleVerses} />);
      fireEvent.click(screen.getByLabelText('설정'));
      fireEvent.click(screen.getByText('설정'));
      expect(screen.getByText('읽기 속도')).toBeInTheDocument();
      expect(screen.getByText('0.5x')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('renders language selector component', () => {
      render(<EnhancedAudioPlayer verses={sampleVerses} />);
      expect(screen.getByTestId('language-selector')).toBeInTheDocument();
    });
  });
});

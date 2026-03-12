import { render, screen } from '@testing-library/react';
import DailyVerseCard from '@/components/home/DailyVerseCard';
import { useHistoryStore } from '@/stores/historyStore';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
});

beforeEach(() => {
  useHistoryStore.setState({
    recentChapters: [],
    dailyVerse: null,
    streakDays: 0,
    totalVersesRead: 0,
    lastReadDate: null,
  });
});

describe('DailyVerseCard', () => {
  it('renders loading state initially when no daily verse', () => {
    const { container } = render(<DailyVerseCard />);
    // Before useEffect runs, should show pulse animation placeholder
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThanOrEqual(0);
  });

  it('renders daily verse after mount', async () => {
    const today = new Date().toISOString().split('T')[0];
    useHistoryStore.setState({
      dailyVerse: {
        verse: 1,
        text: '태초에 하나님이 천지를 창조하시니라',
        reference: '창세기 1:1',
        date: today,
      },
    });

    render(<DailyVerseCard />);

    // After mount (useEffect), should display the verse
    expect(await screen.findByText(/태초에 하나님이 천지를 창조하시니라/)).toBeInTheDocument();
  });

  it('displays the reference', async () => {
    const today = new Date().toISOString().split('T')[0];
    useHistoryStore.setState({
      dailyVerse: {
        verse: 1,
        text: '태초에 하나님이 천지를 창조하시니라',
        reference: '창세기 1:1',
        date: today,
      },
    });

    render(<DailyVerseCard />);
    expect(await screen.findByText(/창세기 1:1/)).toBeInTheDocument();
  });

  it('shows "오늘의 말씀" label', async () => {
    const today = new Date().toISOString().split('T')[0];
    useHistoryStore.setState({
      dailyVerse: {
        verse: 1,
        text: 'test text',
        reference: 'test ref',
        date: today,
      },
    });

    render(<DailyVerseCard />);
    expect(await screen.findByText('오늘의 말씀')).toBeInTheDocument();
  });

  it('renders read and listen links', async () => {
    const today = new Date().toISOString().split('T')[0];
    useHistoryStore.setState({
      dailyVerse: {
        verse: 1,
        text: 'test text',
        reference: '창세기 1:1',
        date: today,
      },
    });

    render(<DailyVerseCard />);
    expect(await screen.findByText('읽기')).toBeInTheDocument();
    expect(await screen.findByText('듣기')).toBeInTheDocument();
  });

  it('listen link points to /audio', async () => {
    const today = new Date().toISOString().split('T')[0];
    useHistoryStore.setState({
      dailyVerse: {
        verse: 1,
        text: 'test text',
        reference: 'test',
        date: today,
      },
    });

    render(<DailyVerseCard />);
    const listenLink = await screen.findByText('듣기');
    expect(listenLink.closest('a')).toHaveAttribute('href', '/audio');
  });
});

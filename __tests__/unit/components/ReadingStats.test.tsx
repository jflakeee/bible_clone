import { render, screen } from '@testing-library/react';
import ReadingStats from '@/components/home/ReadingStats';
import { useHistoryStore } from '@/stores/historyStore';

beforeEach(() => {
  useHistoryStore.setState({
    recentChapters: [],
    dailyVerse: null,
    streakDays: 0,
    totalVersesRead: 0,
    lastReadDate: null,
  });
});

describe('ReadingStats', () => {
  it('renders the section title', async () => {
    render(<ReadingStats />);
    expect(await screen.findByText('읽기 통계')).toBeInTheDocument();
  });

  it('displays streak days', async () => {
    useHistoryStore.setState({ streakDays: 5 });
    render(<ReadingStats />);
    expect(await screen.findByText('5')).toBeInTheDocument();
    expect(await screen.findByText('연속 일수')).toBeInTheDocument();
  });

  it('displays total verses read', async () => {
    useHistoryStore.setState({ totalVersesRead: 42 });
    render(<ReadingStats />);
    expect(await screen.findByText('42')).toBeInTheDocument();
    expect(await screen.findByText('읽은 절 수')).toBeInTheDocument();
  });

  it('displays progress bar section', async () => {
    render(<ReadingStats />);
    expect(await screen.findByText('성경 읽기 진도')).toBeInTheDocument();
  });

  it('displays 0 for empty state', async () => {
    render(<ReadingStats />);
    const zeros = await screen.findAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(2);
  });

  it('counts unique chapters', async () => {
    useHistoryStore.setState({
      recentChapters: [
        { version: 'krv', bookId: 1, bookName: '창세기', chapter: 1, timestamp: new Date().toISOString() },
        { version: 'krv', bookId: 1, bookName: '창세기', chapter: 2, timestamp: new Date().toISOString() },
      ],
    });
    render(<ReadingStats />);
    // Progress should show "2 / 1189장"
    expect(await screen.findByText(/2 \/ 1189장/)).toBeInTheDocument();
  });

  it('shows monthly chapter count label', async () => {
    render(<ReadingStats />);
    expect(await screen.findByText('이번 달 장')).toBeInTheDocument();
  });
});

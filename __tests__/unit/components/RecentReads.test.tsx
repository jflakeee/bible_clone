import { render, screen } from '@testing-library/react';
import RecentReads from '@/components/home/RecentReads';
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

describe('RecentReads', () => {
  it('renders the section title', async () => {
    render(<RecentReads />);
    expect(await screen.findByText('최근 읽은 말씀')).toBeInTheDocument();
  });

  it('shows empty state when no recent reads', async () => {
    render(<RecentReads />);
    expect(await screen.findByText('아직 읽은 기록이 없습니다')).toBeInTheDocument();
  });

  it('shows link to start reading in empty state', async () => {
    render(<RecentReads />);
    const link = await screen.findByText(/창세기부터 시작하기/);
    expect(link.closest('a')).toHaveAttribute('href', '/krv/1/1');
  });

  it('displays recent chapters', async () => {
    useHistoryStore.setState({
      recentChapters: [
        { version: 'krv', bookId: 1, bookName: '창세기', chapter: 1, timestamp: new Date().toISOString() },
        { version: 'krv', bookId: 40, bookName: '마태복음', chapter: 5, timestamp: new Date().toISOString() },
      ],
    });

    render(<RecentReads />);
    expect(await screen.findByText('창세기 1장')).toBeInTheDocument();
    expect(await screen.findByText('마태복음 5장')).toBeInTheDocument();
  });

  it('shows version label in uppercase', async () => {
    useHistoryStore.setState({
      recentChapters: [
        { version: 'krv', bookId: 1, bookName: '창세기', chapter: 1, timestamp: new Date().toISOString() },
      ],
    });

    render(<RecentReads />);
    expect(await screen.findByText('KRV')).toBeInTheDocument();
  });

  it('limits display to 5 entries', async () => {
    const chapters = Array.from({ length: 8 }, (_, i) => ({
      version: 'krv',
      bookId: 1,
      bookName: '창세기',
      chapter: i + 1,
      timestamp: new Date().toISOString(),
    }));
    useHistoryStore.setState({ recentChapters: chapters });

    render(<RecentReads />);
    // Should show chapters 1-5 but not 6-8
    expect(await screen.findByText('창세기 1장')).toBeInTheDocument();
    expect(await screen.findByText('창세기 5장')).toBeInTheDocument();
    expect(screen.queryByText('창세기 6장')).not.toBeInTheDocument();
  });

  it('renders links with correct href', async () => {
    useHistoryStore.setState({
      recentChapters: [
        { version: 'krv', bookId: 1, bookName: '창세기', chapter: 3, timestamp: new Date().toISOString() },
      ],
    });

    render(<RecentReads />);
    const link = await screen.findByText('창세기 3장');
    expect(link.closest('a')).toHaveAttribute('href', '/krv/1/3');
  });

  it('shows time ago text', async () => {
    useHistoryStore.setState({
      recentChapters: [
        { version: 'krv', bookId: 1, bookName: '창세기', chapter: 1, timestamp: new Date().toISOString() },
      ],
    });

    render(<RecentReads />);
    // Just created, so should show "방금 전"
    expect(await screen.findByText('방금 전')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import Header from '@/components/layout/Header';

const mockPathname = jest.fn().mockReturnValue('/');
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

jest.mock('next/link', () => {
  return ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
});

describe('Header', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/');
  });

  it('renders the app title', () => {
    render(<Header />);
    expect(screen.getByText('성경 읽기')).toBeInTheDocument();
  });

  it('renders the title as a link to home', () => {
    render(<Header />);
    const titleLink = screen.getByText('성경 읽기').closest('a');
    expect(titleLink).toHaveAttribute('href', '/');
  });

  it('renders desktop navigation items', () => {
    render(<Header />);
    expect(screen.getByText('홈')).toBeInTheDocument();
    expect(screen.getByText('성경')).toBeInTheDocument();
    expect(screen.getByText('검색')).toBeInTheDocument();
    expect(screen.getByText('북마크')).toBeInTheDocument();
    expect(screen.getByText('기록')).toBeInTheDocument();
    expect(screen.getByText('단어장')).toBeInTheDocument();
    expect(screen.getByText('지도')).toBeInTheDocument();
    expect(screen.getByText('오디오')).toBeInTheDocument();
  });

  it('renders as header element', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('highlights active nav item for home', () => {
    mockPathname.mockReturnValue('/');
    render(<Header />);
    // Find the link with text '홈' that has the correct href
    const homeLinks = screen.getAllByText('홈');
    const navHome = homeLinks.find((el) => el.closest('a')?.getAttribute('href') === '/');
    expect(navHome?.closest('a')?.className).toContain('bg-blue-50');
  });

  it('highlights search when on search page', () => {
    mockPathname.mockReturnValue('/search');
    render(<Header />);
    const searchLink = screen.getByText('검색').closest('a');
    expect(searchLink?.className).toContain('bg-blue-50');
  });

  it('highlights bible when on bible route', () => {
    mockPathname.mockReturnValue('/krv/40/1');
    render(<Header />);
    const bibleLink = screen.getByText('성경').closest('a');
    expect(bibleLink?.className).toContain('bg-blue-50');
  });

  it('renders navigation links with correct hrefs', () => {
    render(<Header />);
    expect(screen.getByText('북마크').closest('a')).toHaveAttribute('href', '/bookmarks');
    expect(screen.getByText('기록').closest('a')).toHaveAttribute('href', '/history');
    expect(screen.getByText('지도').closest('a')).toHaveAttribute('href', '/map');
    expect(screen.getByText('오디오').closest('a')).toHaveAttribute('href', '/audio');
  });
});

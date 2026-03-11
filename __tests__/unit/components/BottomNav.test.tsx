import { render, screen } from '@testing-library/react';
import BottomNav from '@/components/layout/BottomNav';

// Mock next/navigation
const mockPathname = jest.fn().mockReturnValue('/');
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
});

describe('BottomNav', () => {
  beforeEach(() => {
    mockPathname.mockReturnValue('/');
  });

  it('renders all navigation items', () => {
    render(<BottomNav />);
    expect(screen.getByText('홈')).toBeInTheDocument();
    expect(screen.getByText('성경')).toBeInTheDocument();
    expect(screen.getByText('검색')).toBeInTheDocument();
    expect(screen.getByText('단어장')).toBeInTheDocument();
    expect(screen.getByText('더보기')).toBeInTheDocument();
  });

  it('renders links with correct hrefs', () => {
    render(<BottomNav />);
    expect(screen.getByText('홈').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('성경').closest('a')).toHaveAttribute('href', '/krv/1/1');
    expect(screen.getByText('검색').closest('a')).toHaveAttribute('href', '/search');
    expect(screen.getByText('단어장').closest('a')).toHaveAttribute('href', '/vocabulary');
    expect(screen.getByText('더보기').closest('a')).toHaveAttribute('href', '/more');
  });

  it('highlights home when pathname is /', () => {
    mockPathname.mockReturnValue('/');
    render(<BottomNav />);
    const homeLink = screen.getByText('홈').closest('a');
    expect(homeLink?.className).toContain('text-blue-600');
  });

  it('highlights search when pathname is /search', () => {
    mockPathname.mockReturnValue('/search');
    render(<BottomNav />);
    const searchLink = screen.getByText('검색').closest('a');
    expect(searchLink?.className).toContain('text-blue-600');
  });

  it('highlights bible when pathname matches bible route', () => {
    mockPathname.mockReturnValue('/krv/1/1');
    render(<BottomNav />);
    const bibleLink = screen.getByText('성경').closest('a');
    expect(bibleLink?.className).toContain('text-blue-600');
  });

  it('does not highlight home for non-home paths', () => {
    mockPathname.mockReturnValue('/search');
    render(<BottomNav />);
    const homeLink = screen.getByText('홈').closest('a');
    expect(homeLink?.className).not.toContain('text-blue-600');
  });

  it('renders as nav element', () => {
    render(<BottomNav />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });
});

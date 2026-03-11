import { render, screen } from '@testing-library/react';
import BibleActionBar from '@/components/bible/BibleActionBar';

jest.mock('next/link', () => {
  return ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
});

describe('BibleActionBar', () => {
  const defaultProps = {
    version: 'krv',
    bookId: 1,
    bookName: '창세기',
    chapter: 3,
  };

  it('displays current book and chapter', () => {
    render(<BibleActionBar {...defaultProps} />);
    expect(screen.getByText('창세기 3장')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<BibleActionBar {...defaultProps} />);
    expect(screen.getByText('낭독')).toBeInTheDocument();
    expect(screen.getByText('비교')).toBeInTheDocument();
    expect(screen.getByText('지도')).toBeInTheDocument();
    expect(screen.getByText('설교')).toBeInTheDocument();
  });

  it('renders audio link with correct params', () => {
    render(<BibleActionBar {...defaultProps} />);
    const audioLink = screen.getByText('낭독').closest('a');
    expect(audioLink).toHaveAttribute('href', '/audio?version=krv&book=1&chapter=3');
  });

  it('renders compare link with correct params', () => {
    render(<BibleActionBar {...defaultProps} />);
    const compareLink = screen.getByText('비교').closest('a');
    expect(compareLink).toHaveAttribute('href', '/compare?book=1&chapter=3');
  });

  it('renders map link with correct params', () => {
    render(<BibleActionBar {...defaultProps} />);
    const mapLink = screen.getByText('지도').closest('a');
    expect(mapLink).toHaveAttribute('href', '/map?book=1&chapter=3');
  });

  it('renders sermon link with correct params', () => {
    render(<BibleActionBar {...defaultProps} />);
    const sermonLink = screen.getByText('설교').closest('a');
    expect(sermonLink).toHaveAttribute('href', '/sermons?book=1&chapter=3');
  });

  it('updates links when props change', () => {
    const { rerender } = render(<BibleActionBar {...defaultProps} />);
    rerender(<BibleActionBar version="kjv" bookId={40} bookName="마태복음" chapter={5} />);

    expect(screen.getByText('마태복음 5장')).toBeInTheDocument();
    const audioLink = screen.getByText('낭독').closest('a');
    expect(audioLink).toHaveAttribute('href', '/audio?version=kjv&book=40&chapter=5');
  });
});

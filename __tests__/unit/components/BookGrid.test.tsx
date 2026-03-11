import { render, screen, fireEvent } from '@testing-library/react';
import BookGrid from '@/components/home/BookGrid';
import type { Book } from '@/types/bible';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  );
});

const otBooks: Book[] = [
  { id: 1, name: 'Genesis', nameKo: '창세기', abbreviation: 'Gen', testament: 'OT', chapters: 50 },
  { id: 2, name: 'Exodus', nameKo: '출애굽기', abbreviation: 'Exo', testament: 'OT', chapters: 40 },
];

const ntBooks: Book[] = [
  { id: 40, name: 'Matthew', nameKo: '마태복음', abbreviation: 'Mat', testament: 'NT', chapters: 28 },
  { id: 41, name: 'Mark', nameKo: '마가복음', abbreviation: 'Mrk', testament: 'NT', chapters: 16 },
  { id: 42, name: 'Luke', nameKo: '누가복음', abbreviation: 'Luk', testament: 'NT', chapters: 24 },
];

describe('BookGrid', () => {
  it('renders the section title', () => {
    render(<BookGrid otBooks={otBooks} ntBooks={ntBooks} defaultVersion="krv" />);
    expect(screen.getByText('성경 목차')).toBeInTheDocument();
  });

  it('shows OT tab as active by default', () => {
    render(<BookGrid otBooks={otBooks} ntBooks={ntBooks} defaultVersion="krv" />);
    expect(screen.getByText(`구약 (${otBooks.length})`)).toBeInTheDocument();
    expect(screen.getByText(`신약 (${ntBooks.length})`)).toBeInTheDocument();
  });

  it('displays OT books by default', () => {
    render(<BookGrid otBooks={otBooks} ntBooks={ntBooks} defaultVersion="krv" />);
    expect(screen.getByText('창세기')).toBeInTheDocument();
    expect(screen.getByText('출애굽기')).toBeInTheDocument();
    expect(screen.queryByText('마태복음')).not.toBeInTheDocument();
  });

  it('switches to NT books when NT tab is clicked', () => {
    render(<BookGrid otBooks={otBooks} ntBooks={ntBooks} defaultVersion="krv" />);
    fireEvent.click(screen.getByText(`신약 (${ntBooks.length})`));

    expect(screen.getByText('마태복음')).toBeInTheDocument();
    expect(screen.getByText('마가복음')).toBeInTheDocument();
    expect(screen.queryByText('창세기')).not.toBeInTheDocument();
  });

  it('switches back to OT when OT tab is clicked', () => {
    render(<BookGrid otBooks={otBooks} ntBooks={ntBooks} defaultVersion="krv" />);
    fireEvent.click(screen.getByText(`신약 (${ntBooks.length})`));
    fireEvent.click(screen.getByText(`구약 (${otBooks.length})`));

    expect(screen.getByText('창세기')).toBeInTheDocument();
  });

  it('renders links with correct href', () => {
    render(<BookGrid otBooks={otBooks} ntBooks={ntBooks} defaultVersion="krv" />);
    const link = screen.getByText('창세기').closest('a');
    expect(link).toHaveAttribute('href', '/krv/1/1');
  });

  it('displays chapter count', () => {
    render(<BookGrid otBooks={otBooks} ntBooks={ntBooks} defaultVersion="krv" />);
    expect(screen.getByText('50장')).toBeInTheDocument();
    expect(screen.getByText('40장')).toBeInTheDocument();
  });

  it('uses the provided defaultVersion in links', () => {
    render(<BookGrid otBooks={otBooks} ntBooks={ntBooks} defaultVersion="kjv" />);
    const link = screen.getByText('창세기').closest('a');
    expect(link).toHaveAttribute('href', '/kjv/1/1');
  });
});

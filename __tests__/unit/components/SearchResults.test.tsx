import { render, screen } from '@testing-library/react';
import SearchResults from '@/components/search/SearchResults';
import { SearchResult } from '@/types/bible';

// Mock next/link to render as a plain anchor
jest.mock('next/link', () => {
  return ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

const mockResults: SearchResult[] = [
  {
    version: 'krv',
    bookName: '창세기',
    chapter: 1,
    verse: 1,
    text: '태초에 하나님이 천지를 창조하시니라',
    highlight: '태초에 <mark>하나님</mark>이 천지를 창조하시니라',
  },
  {
    version: 'krv',
    bookName: '요한복음',
    chapter: 3,
    verse: 16,
    text: '하나님이 세상을 이처럼 사랑하사',
    highlight: '<mark>하나님</mark>이 세상을 이처럼 사랑하사',
  },
];

describe('SearchResults', () => {
  it('renders loading spinner when loading', () => {
    const { container } = render(
      <SearchResults results={[]} loading={true} error={null} />
    );

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders error message when error is present', () => {
    render(
      <SearchResults results={[]} loading={false} error="Search failed" />
    );

    expect(screen.getByText(/검색 중 오류가 발생했습니다/)).toBeInTheDocument();
    expect(screen.getByText(/Search failed/)).toBeInTheDocument();
  });

  it('renders nothing when results are empty and not loading', () => {
    const { container } = render(
      <SearchResults results={[]} loading={false} error={null} />
    );

    // Should render null (empty container)
    expect(container.firstChild).toBeNull();
  });

  it('renders result count', () => {
    render(
      <SearchResults results={mockResults} loading={false} error={null} />
    );

    expect(screen.getByText('2개의 결과를 찾았습니다')).toBeInTheDocument();
  });

  it('shows max results note when 50 or more results', () => {
    const fiftyResults = Array.from({ length: 50 }, (_, i) => ({
      version: 'krv',
      bookName: '창세기',
      chapter: 1,
      verse: i + 1,
      text: `test text ${i}`,
      highlight: `test text ${i}`,
    }));

    render(
      <SearchResults results={fiftyResults} loading={false} error={null} />
    );

    expect(screen.getByText(/최대 50개/)).toBeInTheDocument();
  });

  it('does not show max results note when under 50 results', () => {
    render(
      <SearchResults results={mockResults} loading={false} error={null} />
    );

    expect(screen.queryByText(/최대 50개/)).not.toBeInTheDocument();
  });

  it('renders result items with book name, chapter, and verse', () => {
    render(
      <SearchResults results={mockResults} loading={false} error={null} />
    );

    expect(screen.getByText('창세기 1:1')).toBeInTheDocument();
    expect(screen.getByText('요한복음 3:16')).toBeInTheDocument();
  });

  it('renders version label for each result', () => {
    render(
      <SearchResults results={mockResults} loading={false} error={null} />
    );

    const versionLabels = screen.getAllByText('krv');
    expect(versionLabels).toHaveLength(2);
  });

  it('renders highlighted text with mark tags via dangerouslySetInnerHTML', () => {
    const { container } = render(
      <SearchResults results={[mockResults[0]]} loading={false} error={null} />
    );

    const markElement = container.querySelector('mark');
    expect(markElement).toBeInTheDocument();
    expect(markElement).toHaveTextContent('하나님');
  });

  it('renders links with correct href', () => {
    render(
      <SearchResults results={[mockResults[0]]} loading={false} error={null} />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute(
      'href',
      '/krv/1?book=%EC%B0%BD%EC%84%B8%EA%B8%B0'
    );
  });

  it('renders multiple results as list items', () => {
    render(
      <SearchResults results={mockResults} loading={false} error={null} />
    );

    const listItems = screen.getAllByRole('link');
    expect(listItems).toHaveLength(2);
  });

  it('prioritizes loading state over error', () => {
    const { container } = render(
      <SearchResults results={[]} loading={true} error="some error" />
    );

    // Should show spinner, not error
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(screen.queryByText(/오류/)).not.toBeInTheDocument();
  });
});

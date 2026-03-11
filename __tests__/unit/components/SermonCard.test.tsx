import React from 'react';
import { render, screen } from '@testing-library/react';
import SermonCard, { SermonCardList } from '@/components/sermon/SermonCard';
import type { Sermon, SermonSearchResult } from '@/types/sermon';

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>;
  };
});

const sampleSermon: Sermon = {
  id: '1',
  title: '하나님의 사랑',
  preacher: '김은혜 목사',
  date: '2024-01-07',
  verses: ['Jhn 3:16', 'Rom 8:38-39'],
  summary: '하나님의 무조건적인 사랑에 대한 설교.',
  content: 'Full content here.',
  tags: ['사랑', '구원', '은혜'],
  source: 'sample',
};

describe('SermonCard', () => {
  it('renders sermon title', () => {
    render(<SermonCard sermon={sampleSermon} />);
    expect(screen.getByText('하나님의 사랑')).toBeInTheDocument();
  });

  it('renders preacher name', () => {
    render(<SermonCard sermon={sampleSermon} />);
    expect(screen.getByText('김은혜 목사')).toBeInTheDocument();
  });

  it('renders date', () => {
    render(<SermonCard sermon={sampleSermon} />);
    expect(screen.getByText('2024-01-07')).toBeInTheDocument();
  });

  it('renders summary by default (not compact)', () => {
    render(<SermonCard sermon={sampleSermon} />);
    expect(screen.getByText(sampleSermon.summary)).toBeInTheDocument();
  });

  it('hides summary in compact mode', () => {
    render(<SermonCard sermon={sampleSermon} compact />);
    expect(screen.queryByText(sampleSermon.summary)).not.toBeInTheDocument();
  });

  it('renders verse references', () => {
    render(<SermonCard sermon={sampleSermon} />);
    expect(screen.getByText('Jhn 3:16')).toBeInTheDocument();
    expect(screen.getByText('Rom 8:38-39')).toBeInTheDocument();
  });

  it('renders tags with # prefix', () => {
    render(<SermonCard sermon={sampleSermon} />);
    expect(screen.getByText('#사랑')).toBeInTheDocument();
    expect(screen.getByText('#구원')).toBeInTheDocument();
    expect(screen.getByText('#은혜')).toBeInTheDocument();
  });

  it('links to sermon detail page', () => {
    render(<SermonCard sermon={sampleSermon} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/sermons/1');
  });

  it('shows relevance score when provided', () => {
    render(<SermonCard sermon={sampleSermon} relevanceScore={8} />);
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('caps relevance score at 100%', () => {
    render(<SermonCard sermon={sampleSermon} relevanceScore={15} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('highlights matched verses', () => {
    const { container } = render(
      <SermonCard sermon={sampleSermon} matchedVerses={['Jhn 3:16']} />
    );
    // Matched verse should have green styling
    const matchedSpan = screen.getByText('Jhn 3:16');
    expect(matchedSpan.className).toContain('bg-green-100');
  });
});

describe('SermonCardList', () => {
  it('renders empty state message when no results', () => {
    render(<SermonCardList results={[]} />);
    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it('renders sermon cards for each result', () => {
    const results: SermonSearchResult[] = [
      { sermon: sampleSermon, relevanceScore: 10, matchedVerses: [] },
      {
        sermon: { ...sampleSermon, id: '2', title: '창조의 신비' },
        relevanceScore: 8,
        matchedVerses: [],
      },
    ];
    render(<SermonCardList results={results} />);
    expect(screen.getByText('하나님의 사랑')).toBeInTheDocument();
    expect(screen.getByText('창조의 신비')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SermonSearch from '@/components/sermon/SermonSearch';

const allTags = ['사랑', '믿음', '소망', '구원', '기도', '은혜', '회개', '감사', '평안', '성령', '거룩', '지혜'];

describe('SermonSearch', () => {
  const onSearch = jest.fn();

  beforeEach(() => {
    onSearch.mockClear();
  });

  describe('search input', () => {
    it('renders search input with placeholder', () => {
      render(<SermonSearch onSearch={onSearch} allTags={allTags} />);
      expect(screen.getByPlaceholderText('설교 검색 (제목, 내용, 설교자...)')).toBeInTheDocument();
    });

    it('renders verse reference input', () => {
      render(<SermonSearch onSearch={onSearch} allTags={allTags} />);
      expect(screen.getByPlaceholderText('구절 (예: Jhn 3:16)')).toBeInTheDocument();
    });

    it('renders search button', () => {
      render(<SermonSearch onSearch={onSearch} allTags={allTags} />);
      expect(screen.getByText('검색')).toBeInTheDocument();
    });

    it('shows loading text when loading', () => {
      render(<SermonSearch onSearch={onSearch} allTags={allTags} loading />);
      expect(screen.getByText('검색 중...')).toBeInTheDocument();
    });

    it('calls onSearch when search button is clicked', () => {
      render(<SermonSearch onSearch={onSearch} allTags={allTags} />);
      const input = screen.getByPlaceholderText('설교 검색 (제목, 내용, 설교자...)');
      fireEvent.change(input, { target: { value: '사랑' } });
      fireEvent.click(screen.getByText('검색'));
      expect(onSearch).toHaveBeenCalledWith('사랑', undefined, undefined);
    });

    it('calls onSearch on Enter key', () => {
      render(<SermonSearch onSearch={onSearch} allTags={allTags} />);
      const input = screen.getByPlaceholderText('설교 검색 (제목, 내용, 설교자...)');
      fireEvent.change(input, { target: { value: '기도' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(onSearch).toHaveBeenCalledWith('기도', undefined, undefined);
    });

    it('includes verse ref in search', () => {
      render(<SermonSearch onSearch={onSearch} allTags={allTags} />);
      const verseInput = screen.getByPlaceholderText('구절 (예: Jhn 3:16)');
      fireEvent.change(verseInput, { target: { value: 'Gen 1:1' } });
      fireEvent.click(screen.getByText('검색'));
      expect(onSearch).toHaveBeenCalledWith('', undefined, 'Gen 1:1');
    });
  });

  describe('tag filters', () => {
    it('renders popular tags by default', () => {
      render(<SermonSearch onSearch={onSearch} allTags={allTags} />);
      expect(screen.getByText('#사랑')).toBeInTheDocument();
      expect(screen.getByText('#믿음')).toBeInTheDocument();
      expect(screen.getByText('#기도')).toBeInTheDocument();
    });

    it('renders tag filter label', () => {
      render(<SermonSearch onSearch={onSearch} allTags={allTags} />);
      expect(screen.getByText('태그 필터')).toBeInTheDocument();
    });

    it('clicking a tag calls onSearch with that tag', () => {
      render(<SermonSearch onSearch={onSearch} allTags={allTags} />);
      fireEvent.click(screen.getByText('#사랑'));
      expect(onSearch).toHaveBeenCalledWith('', '사랑', undefined);
    });

    it('clicking same tag again deselects it', () => {
      render(<SermonSearch onSearch={onSearch} allTags={allTags} />);
      fireEvent.click(screen.getByText('#사랑'));
      onSearch.mockClear();
      fireEvent.click(screen.getByText('#사랑'));
      expect(onSearch).toHaveBeenCalledWith('', undefined, undefined);
    });

    it('shows toggle to show all tags', () => {
      render(<SermonSearch onSearch={onSearch} allTags={allTags} />);
      expect(screen.getByText('모든 태그 보기')).toBeInTheDocument();
    });

    it('shows all tags when toggle clicked', () => {
      render(<SermonSearch onSearch={onSearch} allTags={allTags} />);
      fireEvent.click(screen.getByText('모든 태그 보기'));
      // After toggle, all tags should be visible including ones not in popular
      expect(screen.getByText('#거룩')).toBeInTheDocument();
      expect(screen.getByText('#지혜')).toBeInTheDocument();
      // Toggle text changes
      expect(screen.getByText('인기 태그만 보기')).toBeInTheDocument();
    });
  });
});

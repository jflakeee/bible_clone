import React from 'react';
import { render, screen } from '@testing-library/react';
import ChapterNavigation from '@/components/bible/ChapterNavigation';

// Mock next/link to render a plain anchor
jest.mock('next/link', () => {
  return function MockLink({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
});

describe('ChapterNavigation', () => {
  describe('middle chapter navigation', () => {
    it('renders both previous and next links', () => {
      render(
        <ChapterNavigation version="krv" bookId={1} chapter={25} />
      );

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);
    });

    it('constructs correct prev/next URLs', () => {
      render(
        <ChapterNavigation version="krv" bookId={1} chapter={25} />
      );

      const prevLink = screen.getByText('이전').closest('a');
      const nextLink = screen.getByText('다음').closest('a');

      expect(prevLink).toHaveAttribute('href', '/krv/1/24');
      expect(nextLink).toHaveAttribute('href', '/krv/1/26');
    });

    it('displays the Korean book name and chapter', () => {
      render(
        <ChapterNavigation version="krv" bookId={1} chapter={25} />
      );

      expect(screen.getByText('창세기 25장')).toBeInTheDocument();
    });
  });

  describe('first chapter boundary', () => {
    it('links to previous book last chapter instead of chapter 0', () => {
      // Genesis chapter 1: no previous chapter in Genesis,
      // but there's no book before Genesis (bookId=1), so no prev link
      render(
        <ChapterNavigation version="krv" bookId={1} chapter={1} />
      );

      expect(screen.queryByText('이전')).not.toBeInTheDocument();
      expect(screen.getByText('다음')).toBeInTheDocument();
    });

    it('links to prev book when at chapter 1 of a non-first book', () => {
      // Exodus (bookId=2) chapter 1 -> prev should be Genesis ch 50
      render(
        <ChapterNavigation version="krv" bookId={2} chapter={1} />
      );

      const prevLink = screen.getByText('이전').closest('a');
      expect(prevLink).toHaveAttribute('href', '/krv/1/50');
    });
  });

  describe('last chapter boundary', () => {
    it('has no next link at last chapter of last book', () => {
      // Revelation (bookId=66) chapter 22
      render(
        <ChapterNavigation version="krv" bookId={66} chapter={22} />
      );

      expect(screen.getByText('이전')).toBeInTheDocument();
      expect(screen.queryByText('다음')).not.toBeInTheDocument();
    });

    it('links to next book chapter 1 at last chapter of a mid book', () => {
      // Genesis (bookId=1) chapter 50 -> next = Exodus ch 1
      render(
        <ChapterNavigation version="krv" bookId={1} chapter={50} />
      );

      const nextLink = screen.getByText('다음').closest('a');
      expect(nextLink).toHaveAttribute('href', '/krv/2/1');
    });
  });

  describe('cross-book navigation', () => {
    it('navigates from last chapter of OT to first chapter of NT', () => {
      // Malachi (bookId=39) chapter 4 -> next = Matthew (bookId=40) ch 1
      render(
        <ChapterNavigation version="kjv" bookId={39} chapter={4} />
      );

      const nextLink = screen.getByText('다음').closest('a');
      expect(nextLink).toHaveAttribute('href', '/kjv/40/1');
    });

    it('navigates from first chapter of NT back to last chapter of OT', () => {
      // Matthew (bookId=40) chapter 1 -> prev = Malachi (bookId=39) ch 4
      render(
        <ChapterNavigation version="kjv" bookId={40} chapter={1} />
      );

      const prevLink = screen.getByText('이전').closest('a');
      expect(prevLink).toHaveAttribute('href', '/kjv/39/4');
    });
  });

  describe('version in URLs', () => {
    it('includes the version in navigation links', () => {
      render(
        <ChapterNavigation version="web" bookId={43} chapter={3} />
      );

      const prevLink = screen.getByText('이전').closest('a');
      const nextLink = screen.getByText('다음').closest('a');

      expect(prevLink).toHaveAttribute('href', '/web/43/2');
      expect(nextLink).toHaveAttribute('href', '/web/43/4');
    });
  });

  describe('invalid bookId', () => {
    it('renders nothing for an unknown bookId', () => {
      const { container } = render(
        <ChapterNavigation version="krv" bookId={999} chapter={1} />
      );

      expect(container.innerHTML).toBe('');
    });
  });
});

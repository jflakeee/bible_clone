import { render, screen, fireEvent } from '@testing-library/react';
import BookmarkButton from '@/components/bible/BookmarkButton';
import { useBookmarkStore } from '@/stores/bookmarkStore';

beforeEach(() => {
  useBookmarkStore.setState({ bookmarks: [] });
});

describe('BookmarkButton', () => {
  const defaultProps = {
    bookId: 1,
    chapter: 1,
    verse: 1,
    verseRef: '창세기 1:1',
    version: 'krv',
    text: '태초에 하나님이 천지를 창조하시니라',
  };

  it('renders the bookmark button', () => {
    render(<BookmarkButton {...defaultProps} />);
    expect(screen.getByRole('button', { name: '북마크 추가' })).toBeInTheDocument();
  });

  it('shows "북마크 추가" label when not bookmarked', () => {
    render(<BookmarkButton {...defaultProps} />);
    expect(screen.getByTitle('북마크 추가')).toBeInTheDocument();
  });

  it('shows popover when clicking add bookmark', () => {
    render(<BookmarkButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '북마크 추가' }));
    expect(screen.getByText('색상 선택')).toBeInTheDocument();
    expect(screen.getByText('메모 (선택사항)')).toBeInTheDocument();
  });

  it('shows save button in popover', () => {
    render(<BookmarkButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '북마크 추가' }));
    expect(screen.getByText('저장')).toBeInTheDocument();
  });

  it('shows cancel button in popover', () => {
    render(<BookmarkButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '북마크 추가' }));
    expect(screen.getByText('취소')).toBeInTheDocument();
  });

  it('closes popover on cancel', () => {
    render(<BookmarkButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '북마크 추가' }));
    fireEvent.click(screen.getByText('취소'));
    expect(screen.queryByText('색상 선택')).not.toBeInTheDocument();
  });

  it('saves bookmark and closes popover', () => {
    render(<BookmarkButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '북마크 추가' }));
    fireEvent.click(screen.getByText('저장'));

    expect(useBookmarkStore.getState().bookmarks).toHaveLength(1);
    expect(screen.queryByText('색상 선택')).not.toBeInTheDocument();
  });

  it('shows "북마크 삭제" when already bookmarked', () => {
    useBookmarkStore.getState().addBookmark({
      verseRef: '창세기 1:1', version: 'krv', bookId: 1, chapter: 1, verse: 1,
      text: 'text', color: '#FF6B6B', note: '',
    });

    render(<BookmarkButton {...defaultProps} />);
    expect(screen.getByTitle('북마크 삭제')).toBeInTheDocument();
  });

  it('removes bookmark when clicking on bookmarked verse', () => {
    useBookmarkStore.getState().addBookmark({
      verseRef: '창세기 1:1', version: 'krv', bookId: 1, chapter: 1, verse: 1,
      text: 'text', color: '#FF6B6B', note: '',
    });

    render(<BookmarkButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '북마크 삭제' }));

    expect(useBookmarkStore.getState().bookmarks).toHaveLength(0);
  });

  it('renders color selection buttons', () => {
    render(<BookmarkButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '북마크 추가' }));

    const colorButtons = screen.getAllByRole('button').filter(
      (btn) => btn.getAttribute('aria-label')?.startsWith('색상 ')
    );
    expect(colorButtons.length).toBe(6);
  });

  it('allows entering a note', () => {
    render(<BookmarkButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: '북마크 추가' }));

    const textarea = screen.getByPlaceholderText('메모를 입력하세요...');
    fireEvent.change(textarea, { target: { value: 'My note' } });
    fireEvent.click(screen.getByText('저장'));

    expect(useBookmarkStore.getState().bookmarks[0].note).toBe('My note');
  });
});

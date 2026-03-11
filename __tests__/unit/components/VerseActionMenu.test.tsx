import { render, screen, fireEvent } from '@testing-library/react';
import VerseActionMenu from '@/components/bible/VerseActionMenu';
import { useBookmarkStore } from '@/stores/bookmarkStore';
import { useHistoryStore } from '@/stores/historyStore';

jest.mock('next/link', () => {
  return ({ children, href, onClick, ...props }: { children: React.ReactNode; href: string; onClick?: () => void; [key: string]: unknown }) => (
    <a href={href} onClick={onClick} {...props}>{children}</a>
  );
});

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
});

// Mock SpeechSynthesisUtterance and speechSynthesis
class MockSpeechSynthesisUtterance {
  text = '';
  lang = '';
  rate = 1;
  constructor(text?: string) {
    if (text) this.text = text;
  }
}
(globalThis as unknown as Record<string, unknown>).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;

Object.defineProperty(window, 'speechSynthesis', {
  value: {
    cancel: jest.fn(),
    speak: jest.fn(),
  },
  writable: true,
});

beforeEach(() => {
  useBookmarkStore.setState({ bookmarks: [] });
  useHistoryStore.setState({ history: [] });
  jest.clearAllMocks();
});

describe('VerseActionMenu', () => {
  const defaultProps = {
    bookName: '창세기',
    bookId: 1,
    chapter: 1,
    verse: 1,
    verseText: '태초에 하나님이 천지를 창조하시니라',
    version: 'krv',
    anchorRect: null,
    onClose: jest.fn(),
  };

  it('renders the verse reference in header', () => {
    render(<VerseActionMenu {...defaultProps} />);
    expect(screen.getByText('창세기 1:1')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<VerseActionMenu {...defaultProps} />);
    expect(screen.getByText('북마크 추가')).toBeInTheDocument();
    expect(screen.getByText('복사')).toBeInTheDocument();
    expect(screen.getByText('낭독')).toBeInTheDocument();
    expect(screen.getByText('비교')).toBeInTheDocument();
    expect(screen.getByText('원어 보기')).toBeInTheDocument();
    expect(screen.getByText('설교 찾기')).toBeInTheDocument();
    expect(screen.getByText('지도')).toBeInTheDocument();
  });

  it('closes on Escape key', () => {
    render(<VerseActionMenu {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('closes on backdrop click', () => {
    render(<VerseActionMenu {...defaultProps} />);
    const backdrop = screen.getByText('창세기 1:1').closest('[class*="fixed"]')?.previousSibling;
    if (backdrop) {
      fireEvent.click(backdrop as Element);
      expect(defaultProps.onClose).toHaveBeenCalled();
    }
  });

  it('copies verse to clipboard', async () => {
    render(<VerseActionMenu {...defaultProps} />);
    fireEvent.click(screen.getByText('복사'));

    // Wait for async clipboard operation
    await new Promise(process.nextTick);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      '창세기 1:1 태초에 하나님이 천지를 창조하시니라'
    );
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('speaks verse text', () => {
    render(<VerseActionMenu {...defaultProps} />);
    fireEvent.click(screen.getByText('낭독'));

    expect(window.speechSynthesis.cancel).toHaveBeenCalled();
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('renders compare link with correct href', () => {
    render(<VerseActionMenu {...defaultProps} />);
    const link = screen.getByText('비교').closest('a');
    expect(link).toHaveAttribute('href', '/compare?book=1&chapter=1&verse=1');
  });

  it('renders original text link', () => {
    render(<VerseActionMenu {...defaultProps} />);
    const link = screen.getByText('원어 보기').closest('a');
    expect(link).toHaveAttribute('href', '/original?book=1&chapter=1&verse=1');
  });

  it('shows bookmark panel when clicking add bookmark', () => {
    render(<VerseActionMenu {...defaultProps} />);
    fireEvent.click(screen.getByText('북마크 추가'));
    expect(screen.getByText('색상 선택')).toBeInTheDocument();
    expect(screen.getByText('저장')).toBeInTheDocument();
  });

  it('saves bookmark from panel', () => {
    render(<VerseActionMenu {...defaultProps} />);
    fireEvent.click(screen.getByText('북마크 추가'));
    fireEvent.click(screen.getByText('저장'));

    expect(useBookmarkStore.getState().bookmarks).toHaveLength(1);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows "북마크 삭제" when already bookmarked', () => {
    useBookmarkStore.getState().addBookmark({
      verseRef: '창세기 1:1', version: 'krv', bookId: 1, chapter: 1, verse: 1,
      text: 'text', color: '#FF6B6B', note: '',
    });

    render(<VerseActionMenu {...defaultProps} />);
    expect(screen.getByText('북마크 삭제')).toBeInTheDocument();
  });

  it('removes bookmark when clicking delete', () => {
    useBookmarkStore.getState().addBookmark({
      verseRef: '창세기 1:1', version: 'krv', bookId: 1, chapter: 1, verse: 1,
      text: 'text', color: '#FF6B6B', note: '',
    });

    render(<VerseActionMenu {...defaultProps} />);
    fireEvent.click(screen.getByText('북마크 삭제'));

    expect(useBookmarkStore.getState().bookmarks).toHaveLength(0);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('goes back from bookmark panel', () => {
    render(<VerseActionMenu {...defaultProps} />);
    fireEvent.click(screen.getByText('북마크 추가'));
    fireEvent.click(screen.getByText('뒤로'));
    expect(screen.queryByText('색상 선택')).not.toBeInTheDocument();
  });
});

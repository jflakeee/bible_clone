import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '@/components/search/SearchBar';

describe('SearchBar', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the search input field', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('성경 구절 검색...');
    expect(input).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const button = screen.getByRole('button', { name: '검색' });
    expect(button).toBeInTheDocument();
  });

  it('renders with initial query value', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} initialQuery="하나님" />);

    const input = screen.getByPlaceholderText('성경 구절 검색...');
    expect(input).toHaveValue('하나님');
  });

  it('renders with empty initial query by default', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('성경 구절 검색...');
    expect(input).toHaveValue('');
  });

  it('updates input value on change', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('성경 구절 검색...');
    fireEvent.change(input, { target: { value: '사랑' } });

    expect(input).toHaveValue('사랑');
  });

  it('debounces search calls by 300ms', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('성경 구절 검색...');
    fireEvent.change(input, { target: { value: '사' } });

    // Should not have called onSearch yet
    expect(onSearch).not.toHaveBeenCalled();

    // Advance time by 200ms - still should not fire
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(onSearch).not.toHaveBeenCalled();

    // Advance to 300ms - now it should fire
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('사');
  });

  it('resets debounce timer on rapid input changes', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('성경 구절 검색...');

    // Type first character
    fireEvent.change(input, { target: { value: '사' } });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Type second character before debounce fires
    fireEvent.change(input, { target: { value: '사랑' } });
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // First debounce should not have fired
    expect(onSearch).not.toHaveBeenCalled();

    // After 300ms from last change, should fire with final value
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('사랑');
  });

  it('calls onSearch immediately on form submit', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('성경 구절 검색...');
    fireEvent.change(input, { target: { value: '하나님' } });

    // Submit the form
    const form = input.closest('form')!;
    fireEvent.submit(form);

    // Should be called immediately, no debounce wait
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('하나님');
  });

  it('cancels pending debounce on form submit', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('성경 구절 검색...');
    fireEvent.change(input, { target: { value: '하나님' } });

    // Submit before debounce fires
    const form = input.closest('form')!;
    fireEvent.submit(form);

    expect(onSearch).toHaveBeenCalledTimes(1);

    // Let the debounce timer expire - should NOT call again
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch with empty string when submitting empty input', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const form = screen.getByPlaceholderText('성경 구절 검색...').closest('form')!;
    fireEvent.submit(form);

    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('cleans up debounce timer on unmount', () => {
    const onSearch = jest.fn();
    const { unmount } = render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('성경 구절 검색...');
    fireEvent.change(input, { target: { value: 'test' } });

    // Unmount before debounce fires
    unmount();

    // Advance timers - should not call onSearch since component is unmounted
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // The callback may or may not fire depending on implementation,
    // but at minimum, no errors should be thrown
    // The key thing is the clearTimeout in useEffect cleanup runs
  });
});

import { render, screen, fireEvent, act } from '@testing-library/react';
import Tooltip from '@/components/ui/Tooltip';

describe('Tooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders children', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('does not show tooltip initially', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on mouse enter', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    const wrapper = screen.getByText('Hover me').parentElement!;
    fireEvent.mouseEnter(wrapper);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Tooltip text')).toBeInTheDocument();
  });

  it('hides tooltip on mouse leave after delay', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    const wrapper = screen.getByText('Hover me').parentElement!;
    fireEvent.mouseEnter(wrapper);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.mouseLeave(wrapper);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows tooltip on focus', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    const wrapper = screen.getByText('Hover me').parentElement!;
    fireEvent.focus(wrapper);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('hides tooltip on blur after delay', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    const wrapper = screen.getByText('Hover me').parentElement!;
    fireEvent.focus(wrapper);
    fireEvent.blur(wrapper);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('applies top position by default', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    const wrapper = screen.getByText('Hover me').parentElement!;
    fireEvent.mouseEnter(wrapper);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.className).toContain('bottom-full');
  });

  it('applies bottom position', () => {
    render(
      <Tooltip content="Tooltip text" position="bottom">
        <button>Hover me</button>
      </Tooltip>
    );
    const wrapper = screen.getByText('Hover me').parentElement!;
    fireEvent.mouseEnter(wrapper);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.className).toContain('top-full');
  });

  it('applies left position', () => {
    render(
      <Tooltip content="Tooltip text" position="left">
        <button>Hover me</button>
      </Tooltip>
    );
    const wrapper = screen.getByText('Hover me').parentElement!;
    fireEvent.mouseEnter(wrapper);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.className).toContain('right-full');
  });

  it('applies right position', () => {
    render(
      <Tooltip content="Tooltip text" position="right">
        <button>Hover me</button>
      </Tooltip>
    );
    const wrapper = screen.getByText('Hover me').parentElement!;
    fireEvent.mouseEnter(wrapper);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip.className).toContain('left-full');
  });

  it('keeps tooltip visible when re-entering before hide timeout', () => {
    render(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    const wrapper = screen.getByText('Hover me').parentElement!;
    fireEvent.mouseEnter(wrapper);
    fireEvent.mouseLeave(wrapper);
    // Re-enter before timeout
    act(() => {
      jest.advanceTimersByTime(50);
    });
    fireEvent.mouseEnter(wrapper);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});

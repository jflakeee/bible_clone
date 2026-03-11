import { render, screen } from '@testing-library/react';
import Loading from '@/components/ui/Loading';

describe('Loading', () => {
  it('renders with role="status"', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has default aria-label "로딩 중"', () => {
    render(<Loading />);
    expect(screen.getByLabelText('로딩 중')).toBeInTheDocument();
  });

  it('uses custom text as aria-label', () => {
    render(<Loading text="데이터 불러오는 중" />);
    expect(screen.getByLabelText('데이터 불러오는 중')).toBeInTheDocument();
  });

  it('displays text when provided', () => {
    render(<Loading text="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('does not display text when not provided', () => {
    const { container } = render(<Loading />);
    const spans = container.querySelectorAll('span');
    expect(spans).toHaveLength(0);
  });

  it('renders spinner svg', () => {
    const { container } = render(<Loading />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.classList.contains('animate-spin')).toBe(true);
  });

  it('applies sm size', () => {
    const { container } = render(<Loading size="sm" />);
    const svg = container.querySelector('svg');
    expect(svg?.classList.contains('h-5')).toBe(true);
    expect(svg?.classList.contains('w-5')).toBe(true);
  });

  it('applies md size by default', () => {
    const { container } = render(<Loading />);
    const svg = container.querySelector('svg');
    expect(svg?.classList.contains('h-8')).toBe(true);
    expect(svg?.classList.contains('w-8')).toBe(true);
  });

  it('applies lg size', () => {
    const { container } = render(<Loading size="lg" />);
    const svg = container.querySelector('svg');
    expect(svg?.classList.contains('h-12')).toBe(true);
    expect(svg?.classList.contains('w-12')).toBe(true);
  });

  it('applies text size for sm', () => {
    render(<Loading size="sm" text="Loading" />);
    const span = screen.getByText('Loading');
    expect(span.className).toContain('text-xs');
  });

  it('applies text size for lg', () => {
    render(<Loading size="lg" text="Loading" />);
    const span = screen.getByText('Loading');
    expect(span.className).toContain('text-base');
  });

  it('applies custom className', () => {
    render(<Loading className="my-class" />);
    expect(screen.getByRole('status').className).toContain('my-class');
  });
});

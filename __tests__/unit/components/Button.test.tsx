import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders as button element', () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-blue-500');
  });

  it('applies secondary variant', () => {
    render(<Button variant="secondary">Test</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-gray-100');
  });

  it('applies ghost variant', () => {
    render(<Button variant="ghost">Test</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-transparent');
  });

  it('applies danger variant', () => {
    render(<Button variant="danger">Test</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-red-500');
  });

  it('applies sm size', () => {
    render(<Button size="sm">Test</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('text-xs');
  });

  it('applies md size by default', () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('text-sm');
  });

  it('applies lg size', () => {
    render(<Button size="lg">Test</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('text-base');
  });

  it('shows spinner when loading', () => {
    render(<Button loading>Test</Button>);
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.classList.contains('animate-spin')).toBe(true);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Test</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Test</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('handles click events', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Test</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire click when disabled', () => {
    const onClick = jest.fn();
    render(<Button disabled onClick={onClick}>Test</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('appends custom className', () => {
    render(<Button className="my-custom-class">Test</Button>);
    expect(screen.getByRole('button').className).toContain('my-custom-class');
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

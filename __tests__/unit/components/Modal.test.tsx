import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '@/components/ui/Modal';

describe('Modal', () => {
  it('does not render when open is false', () => {
    render(
      <Modal open={false} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('renders when open is true', () => {
    render(
      <Modal open={true} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Modal open={true} onClose={jest.fn()} title="Test Title">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('has dialog role and aria-modal', () => {
    render(
      <Modal open={true} onClose={jest.fn()} title="Test">
        <p>Content</p>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('has aria-label from title', () => {
    render(
      <Modal open={true} onClose={jest.fn()} title="My Modal">
        <p>Content</p>
      </Modal>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-label', 'My Modal');
  });

  it('renders close button', () => {
    render(
      <Modal open={true} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByLabelText('닫기')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = jest.fn();
    render(
      <Modal open={true} onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByLabelText('닫기'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay clicked', () => {
    const onClose = jest.fn();
    render(
      <Modal open={true} onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    const overlay = screen.getByRole('dialog').querySelector('[aria-hidden="true"]');
    if (overlay) {
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = jest.fn();
    render(
      <Modal open={true} onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for other keys', () => {
    const onClose = jest.fn();
    render(
      <Modal open={true} onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('prevents body scroll when open', () => {
    render(
      <Modal open={true} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll when closed', () => {
    const { rerender } = render(
      <Modal open={true} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    rerender(
      <Modal open={false} onClose={jest.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('renders children', () => {
    render(
      <Modal open={true} onClose={jest.fn()}>
        <div data-testid="child">Child content</div>
      </Modal>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});

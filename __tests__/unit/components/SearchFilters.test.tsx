import { render, screen, fireEvent } from '@testing-library/react';
import SearchFilters from '@/components/search/SearchFilters';

// Mock the constants module
jest.mock('@/lib/constants', () => ({
  SUPPORTED_VERSIONS: [
    { id: 'krv', name: '개역한글', language: 'ko' },
    { id: 'kjv', name: 'King James Version', language: 'en' },
    { id: 'web', name: 'World English Bible', language: 'en' },
  ],
}));

describe('SearchFilters', () => {
  const defaultProps = {
    version: 'krv',
    testament: 'all',
    onVersionChange: jest.fn(),
    onTestamentChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders version filter with label', () => {
    render(<SearchFilters {...defaultProps} />);

    expect(screen.getByLabelText('번역본:')).toBeInTheDocument();
  });

  it('renders testament filter with label', () => {
    render(<SearchFilters {...defaultProps} />);

    expect(screen.getByLabelText('범위:')).toBeInTheDocument();
  });

  it('renders all supported versions as options', () => {
    render(<SearchFilters {...defaultProps} />);

    const versionSelect = screen.getByLabelText('번역본:');
    const options = versionSelect.querySelectorAll('option');

    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('개역한글');
    expect(options[1]).toHaveTextContent('King James Version');
    expect(options[2]).toHaveTextContent('World English Bible');
  });

  it('renders version options with correct values', () => {
    render(<SearchFilters {...defaultProps} />);

    const versionSelect = screen.getByLabelText('번역본:');
    const options = versionSelect.querySelectorAll('option');

    expect(options[0]).toHaveValue('krv');
    expect(options[1]).toHaveValue('kjv');
    expect(options[2]).toHaveValue('web');
  });

  it('renders testament filter options', () => {
    render(<SearchFilters {...defaultProps} />);

    const testamentSelect = screen.getByLabelText('범위:');
    const options = testamentSelect.querySelectorAll('option');

    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('전체');
    expect(options[0]).toHaveValue('all');
    expect(options[1]).toHaveTextContent('구약');
    expect(options[1]).toHaveValue('ot');
    expect(options[2]).toHaveTextContent('신약');
    expect(options[2]).toHaveValue('nt');
  });

  it('sets version select value from props', () => {
    render(<SearchFilters {...defaultProps} version="kjv" />);

    const versionSelect = screen.getByLabelText('번역본:') as HTMLSelectElement;
    expect(versionSelect.value).toBe('kjv');
  });

  it('sets testament select value from props', () => {
    render(<SearchFilters {...defaultProps} testament="nt" />);

    const testamentSelect = screen.getByLabelText('범위:') as HTMLSelectElement;
    expect(testamentSelect.value).toBe('nt');
  });

  it('calls onVersionChange when version is changed', () => {
    const onVersionChange = jest.fn();
    render(<SearchFilters {...defaultProps} onVersionChange={onVersionChange} />);

    const versionSelect = screen.getByLabelText('번역본:');
    fireEvent.change(versionSelect, { target: { value: 'kjv' } });

    expect(onVersionChange).toHaveBeenCalledTimes(1);
    expect(onVersionChange).toHaveBeenCalledWith('kjv');
  });

  it('calls onTestamentChange when testament is changed', () => {
    const onTestamentChange = jest.fn();
    render(<SearchFilters {...defaultProps} onTestamentChange={onTestamentChange} />);

    const testamentSelect = screen.getByLabelText('범위:');
    fireEvent.change(testamentSelect, { target: { value: 'ot' } });

    expect(onTestamentChange).toHaveBeenCalledTimes(1);
    expect(onTestamentChange).toHaveBeenCalledWith('ot');
  });

  it('calls onTestamentChange with "nt" when New Testament selected', () => {
    const onTestamentChange = jest.fn();
    render(<SearchFilters {...defaultProps} onTestamentChange={onTestamentChange} />);

    const testamentSelect = screen.getByLabelText('범위:');
    fireEvent.change(testamentSelect, { target: { value: 'nt' } });

    expect(onTestamentChange).toHaveBeenCalledWith('nt');
  });

  it('calls onVersionChange with "web" when World English Bible selected', () => {
    const onVersionChange = jest.fn();
    render(<SearchFilters {...defaultProps} onVersionChange={onVersionChange} />);

    const versionSelect = screen.getByLabelText('번역본:');
    fireEvent.change(versionSelect, { target: { value: 'web' } });

    expect(onVersionChange).toHaveBeenCalledWith('web');
  });
});

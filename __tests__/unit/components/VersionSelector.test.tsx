import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VersionSelector from '@/components/bible/VersionSelector';
import { SUPPORTED_VERSIONS } from '@/lib/constants';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/krv/1/1',
}));

beforeEach(() => {
  mockPush.mockReset();
});

describe('VersionSelector', () => {
  describe('rendering', () => {
    it('renders a select element', () => {
      render(
        <VersionSelector currentVersion="krv" bookId={1} chapter={1} />
      );

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders all supported version options', () => {
      render(
        <VersionSelector currentVersion="krv" bookId={1} chapter={1} />
      );

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(SUPPORTED_VERSIONS.length);
    });

    it('displays version names as option text', () => {
      render(
        <VersionSelector currentVersion="krv" bookId={1} chapter={1} />
      );

      expect(screen.getByText('개역한글')).toBeInTheDocument();
      expect(screen.getByText('King James Version')).toBeInTheDocument();
      expect(screen.getByText('World English Bible')).toBeInTheDocument();
    });

    it('has option values matching version ids', () => {
      render(
        <VersionSelector currentVersion="krv" bookId={1} chapter={1} />
      );

      const options = screen.getAllByRole('option') as HTMLOptionElement[];
      const values = options.map((o) => o.value);
      expect(values).toContain('krv');
      expect(values).toContain('kjv');
      expect(values).toContain('web');
    });

    it('selects the current version', () => {
      render(
        <VersionSelector currentVersion="kjv" bookId={1} chapter={1} />
      );

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('kjv');
    });
  });

  describe('version change', () => {
    it('navigates to the new version URL on change', () => {
      render(
        <VersionSelector currentVersion="krv" bookId={1} chapter={1} />
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'kjv' } });

      expect(mockPush).toHaveBeenCalledWith('/kjv/1/1');
    });

    it('preserves bookId and chapter in the URL', () => {
      render(
        <VersionSelector currentVersion="krv" bookId={43} chapter={3} />
      );

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'web' } });

      expect(mockPush).toHaveBeenCalledWith('/web/43/3');
    });

    it('navigates correctly for each version', () => {
      render(
        <VersionSelector currentVersion="krv" bookId={19} chapter={23} />
      );

      const select = screen.getByRole('combobox');

      fireEvent.change(select, { target: { value: 'kjv' } });
      expect(mockPush).toHaveBeenCalledWith('/kjv/19/23');

      fireEvent.change(select, { target: { value: 'web' } });
      expect(mockPush).toHaveBeenCalledWith('/web/19/23');
    });
  });
});

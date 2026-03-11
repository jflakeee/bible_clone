'use client';

import { useRouter, usePathname } from 'next/navigation';
import { SUPPORTED_VERSIONS } from '@/lib/constants';

interface VersionSelectorProps {
  currentVersion: string;
  bookId: number;
  chapter: number;
}

export default function VersionSelector({
  currentVersion,
  bookId,
  chapter,
}: VersionSelectorProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVersion = e.target.value;
    router.push(`/${newVersion}/${bookId}/${chapter}`);
  };

  return (
    <select
      value={currentVersion}
      onChange={handleChange}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
    >
      {SUPPORTED_VERSIONS.map((v) => (
        <option key={v.id} value={v.id}>
          {v.name}
        </option>
      ))}
    </select>
  );
}

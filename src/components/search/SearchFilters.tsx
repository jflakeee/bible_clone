'use client';

import { SUPPORTED_VERSIONS } from '@/lib/constants';

interface SearchFiltersProps {
  version: string;
  testament: string;
  onVersionChange: (version: string) => void;
  onTestamentChange: (testament: string) => void;
}

export default function SearchFilters({
  version,
  testament,
  onVersionChange,
  onTestamentChange,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <label htmlFor="version-filter" className="text-sm text-gray-600 whitespace-nowrap">
          번역본:
        </label>
        <select
          id="version-filter"
          value={version}
          onChange={(e) => onVersionChange(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {SUPPORTED_VERSIONS.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="testament-filter" className="text-sm text-gray-600 whitespace-nowrap">
          범위:
        </label>
        <select
          id="testament-filter"
          value={testament}
          onChange={(e) => onTestamentChange(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">전체</option>
          <option value="ot">구약</option>
          <option value="nt">신약</option>
        </select>
      </div>
    </div>
  );
}

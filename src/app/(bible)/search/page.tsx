'use client';

import { useState, useCallback } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { useHistoryStore } from '@/stores/historyStore';
import SearchBar from '@/components/search/SearchBar';
import SearchFilters from '@/components/search/SearchFilters';
import SearchResults from '@/components/search/SearchResults';

export default function SearchPage() {
  const [version, setVersion] = useState('krv');
  const [testament, setTestament] = useState('all');
  const [currentQuery, setCurrentQuery] = useState('');
  const { results, loading, error, search } = useSearch();
  const addHistory = useHistoryStore((s) => s.addHistory);

  const handleSearch = useCallback(
    (query: string) => {
      setCurrentQuery(query);
      search(query, version, testament);
      if (query.trim()) {
        addHistory({
          actionType: 'search',
          targetType: 'verse',
          targetId: `search-${query}-${version}`,
          targetLabel: `"${query}" 검색`,
          metadata: { query, version, testament },
        });
      }
    },
    [search, version, testament, addHistory]
  );

  const handleVersionChange = useCallback(
    (newVersion: string) => {
      setVersion(newVersion);
      if (currentQuery.trim()) {
        search(currentQuery, newVersion, testament);
      }
    },
    [search, currentQuery, testament]
  );

  const handleTestamentChange = useCallback(
    (newTestament: string) => {
      setTestament(newTestament);
      if (currentQuery.trim()) {
        search(currentQuery, version, newTestament);
      }
    },
    [search, currentQuery, version]
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">성경 검색</h1>

      <div className="space-y-4">
        <SearchBar onSearch={handleSearch} />

        <SearchFilters
          version={version}
          testament={testament}
          onVersionChange={handleVersionChange}
          onTestamentChange={handleTestamentChange}
        />

        <div className="mt-6">
          <SearchResults results={results} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}

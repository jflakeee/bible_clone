'use client';

import { useState, useCallback, useRef } from 'react';
import { StrongsEntry } from '@/types/bible';
import { useHistoryStore } from '@/stores/historyStore';
import StrongsPopover from '@/components/bible/StrongsPopover';
import { fetchStrongsEntry, fetchStrongsSearch } from '@/lib/client-api';

export default function StrongsBrowsePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StrongsEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Popover state
  const [selectedEntry, setSelectedEntry] = useState<StrongsEntry | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<DOMRect | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const addHistory = useHistoryStore((s) => s.addHistory);

  const handleSearch = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const q = query.trim();
      if (!q) return;

      setLoading(true);
      setSearched(true);

      try {
        // If the query looks like a Strong's number, do a direct lookup
        if (/^[HhGg]\d+$/.test(q)) {
          const entry = await fetchStrongsEntry(q.toUpperCase());
          if (entry) {
            setResults([entry]);
          } else {
            setResults([]);
          }
        } else {
          // Search by keyword
          const data = await fetchStrongsSearch(q);
          setResults(data);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  const handleEntryClick = (entry: StrongsEntry, event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setSelectedEntry(entry);
    setPopoverAnchor(rect);
    addHistory({
      actionType: 'lookup_word',
      targetType: 'word',
      targetId: entry.number,
      targetLabel: `${entry.number} ${entry.transliteration || entry.lemma}`,
      metadata: { strongsNumber: entry.number, language: entry.language },
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Strong&apos;s Concordance
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Search the Strong&apos;s Hebrew and Greek dictionary by number or
          English keyword.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Strong's number (H1234, G5678) or English word..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Quick examples */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Try:
          </span>
          {['H1', 'H430', 'G26', 'G2316', 'love', 'grace', 'faith'].map(
            (example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setQuery(example);
                  // Trigger search after setting query
                  setTimeout(() => {
                    inputRef.current?.form?.requestSubmit();
                  }, 0);
                }}
                className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {example}
              </button>
            )
          )}
        </div>
      </form>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <p className="text-gray-500 dark:text-gray-400">
            No entries found for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-2">
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>

          {results.map((entry) => (
            <button
              key={entry.number}
              onClick={(e) => handleEntryClick(entry, e)}
              className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {entry.number}
                    </span>
                    <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                      {entry.language === 'hebrew' ? 'Hebrew' : 'Greek'}
                    </span>
                    {entry.transliteration && (
                      <span className="text-sm italic text-gray-500 dark:text-gray-400">
                        {entry.transliteration}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-gray-700 dark:text-gray-300">
                    {entry.shortDefinition || entry.definition}
                  </p>
                </div>
                <span
                  className="shrink-0 text-xl"
                  style={{
                    fontFamily:
                      entry.language === 'hebrew'
                        ? '"SBL Hebrew", "Ezra SIL", serif'
                        : '"SBL Greek", "Gentium Plus", serif',
                    direction: entry.language === 'hebrew' ? 'rtl' : 'ltr',
                  }}
                >
                  {entry.lemma}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Popover for selected entry */}
      {selectedEntry && (
        <StrongsPopover
          entry={selectedEntry}
          loading={false}
          anchorRect={popoverAnchor}
          onClose={() => {
            setSelectedEntry(null);
            setPopoverAnchor(null);
          }}
        />
      )}
    </div>
  );
}

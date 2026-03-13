'use client';

import { CompareResult, VerseWord } from '@/types/bible';
import { SUPPORTED_VERSIONS } from '@/lib/constants';

interface CompareViewProps {
  results: CompareResult[];
  versions: string[];
  showOriginal?: boolean;
}

function OriginalWordDisplay({ words }: { words: VerseWord[] }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1" dir="auto">
      {words.map((w, i) => (
        <span key={i} className="inline-flex flex-col items-center text-center group">
          <span className="text-base font-serif text-amber-900 dark:text-amber-200">
            {w.word}
          </span>
          {w.transliteration && (
            <span className="text-[10px] text-gray-500 italic">
              {w.transliteration}
            </span>
          )}
          {w.gloss && (
            <span className="text-[10px] text-blue-600 dark:text-blue-400">
              {w.gloss}
            </span>
          )}
          {w.strongsNumber && (
            <span className="text-[9px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              {w.strongsNumber}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

export default function CompareView({ results, versions, showOriginal }: CompareViewProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        비교할 구절을 선택해주세요.
      </div>
    );
  }

  const getVersionName = (abbr: string) => {
    const v = SUPPORTED_VERSIONS.find((sv) => sv.id === abbr);
    return v?.name || abbr;
  };

  return (
    <div className="space-y-4">
      {/* Desktop: side-by-side columns */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b-2 border-gray-200 w-12">
                절
              </th>
              {versions.map((v) => (
                <th
                  key={v}
                  className="p-3 text-left text-sm font-semibold text-gray-800 border-b-2 border-gray-200"
                >
                  {getVersionName(v)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <>
                <tr
                  key={result.verse}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3 text-sm font-medium text-gray-500 align-top" rowSpan={showOriginal && result.originalWords ? 2 : 1}>
                    {result.verse}
                  </td>
                  {result.versions.map((vData) => (
                    <td
                      key={vData.abbreviation}
                      className="p-3 text-sm leading-relaxed text-gray-800 align-top"
                    >
                      {vData.text || (
                        <span className="text-gray-400 italic">구절 없음</span>
                      )}
                    </td>
                  ))}
                </tr>
                {showOriginal && result.originalWords && (
                  <tr key={`${result.verse}-orig`} className="border-b border-gray-100 bg-amber-50/50">
                    <td colSpan={versions.length} className="p-3">
                      <OriginalWordDisplay words={result.originalWords} />
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked layout */}
      <div className="md:hidden space-y-6">
        {results.map((result) => (
          <div
            key={result.verse}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
              {result.verse}절
            </div>
            <div className="divide-y divide-gray-100">
              {result.versions.map((vData) => (
                <div key={vData.abbreviation} className="px-4 py-3">
                  <div className="text-xs font-medium text-blue-600 mb-1">
                    {getVersionName(vData.abbreviation)}
                  </div>
                  <div className="text-sm leading-relaxed text-gray-800">
                    {vData.text || (
                      <span className="text-gray-400 italic">구절 없음</span>
                    )}
                  </div>
                </div>
              ))}
              {showOriginal && result.originalWords && (
                <div className="px-4 py-3 bg-amber-50/50">
                  <div className="text-xs font-medium text-amber-700 mb-2">원어</div>
                  <OriginalWordDisplay words={result.originalWords} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

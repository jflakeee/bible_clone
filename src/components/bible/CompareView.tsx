'use client';

import { CompareResult } from '@/types/bible';
import { SUPPORTED_VERSIONS } from '@/lib/constants';

interface CompareViewProps {
  results: CompareResult[];
  versions: string[];
}

export default function CompareView({ results, versions }: CompareViewProps) {
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
              <tr
                key={result.verse}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="p-3 text-sm font-medium text-gray-500 align-top">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from 'next/link';

const MORE_LINKS = [
  { href: '/bookmarks', label: '북마크', desc: '저장한 구절 모아보기' },
  { href: '/history', label: '읽기 기록', desc: '읽기 활동 및 통계' },
  { href: '/compare', label: '번역 비교', desc: '여러 번역을 나란히 비교' },
  { href: '/multilang', label: '다국어 성경', desc: '1000+ 번역 탐색' },
  { href: '/strongs', label: 'Strong\'s 사전', desc: '히브리어/헬라어 사전' },
  { href: '/original', label: '원문 보기', desc: '히브리어/헬라어 원문' },
  { href: '/map', label: '성경 지도', desc: '성경 속 지명 탐색' },
  { href: '/audio', label: '오디오 성경', desc: '성경 듣기' },
  { href: '/sermons', label: '설교', desc: '성경 본문별 설교' },
  { href: '/proper-nouns', label: '고유명사', desc: '성경 인물/지명 사전' },
];

export default function MorePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-lg px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          더보기
        </h1>
        <div className="space-y-2">
          {MORE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600 dark:hover:bg-blue-950"
            >
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {link.label}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {link.desc}
                </div>
              </div>
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

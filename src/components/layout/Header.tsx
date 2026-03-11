'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DESKTOP_NAV = [
  { href: '/', label: '홈', exact: true },
  { href: '/krv/1/1', label: '성경', match: /^\/[a-z]+\/\d+\/\d+/ },
  { href: '/search', label: '검색' },
  { href: '/bookmarks', label: '북마크' },
  { href: '/history', label: '기록' },
  { href: '/vocabulary', label: '단어장' },
  { href: '/map', label: '지도' },
  { href: '/audio', label: '오디오' },
];

export default function Header() {
  const pathname = usePathname();

  function isActive(item: typeof DESKTOP_NAV[0]) {
    if ('exact' in item && item.exact) return pathname === item.href;
    if ('match' in item && item.match) return item.match.test(pathname);
    return pathname.startsWith(item.href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-100"
        >
          <svg className="h-7 w-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="font-serif">성경 읽기</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {DESKTOP_NAV.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

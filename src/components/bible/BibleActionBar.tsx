'use client';

import Link from 'next/link';

interface BibleActionBarProps {
  version: string;
  bookId: number;
  bookName: string;
  chapter: number;
}

export default function BibleActionBar({
  version,
  bookId,
  bookName,
  chapter,
}: BibleActionBarProps) {
  const actions = [
    {
      label: '낭독',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      ),
      href: `/audio?version=${version}&book=${bookId}&chapter=${chapter}`,
    },
    {
      label: '비교',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      href: `/compare?book=${bookId}&chapter=${chapter}`,
    },
    {
      label: '지도',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      href: `/map?book=${bookId}&chapter=${chapter}`,
    },
    {
      label: '설교',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
        </svg>
      ),
      href: `/sermons?book=${bookId}&chapter=${chapter}`,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
      {/* Current location indicator */}
      <div className="border-b border-gray-100 px-4 py-1.5 text-center dark:border-gray-800">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {bookName} {chapter}장
        </span>
      </div>

      {/* Action buttons */}
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400"
          >
            {action.icon}
            <span className="text-[10px] font-medium">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

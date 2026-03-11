'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Book } from '@/types/bible';

interface Props {
  otBooks: Book[];
  ntBooks: Book[];
  defaultVersion: string;
}

export default function BookGrid({ otBooks, ntBooks, defaultVersion }: Props) {
  const [activeTab, setActiveTab] = useState<'OT' | 'NT'>('OT');

  const books = activeTab === 'OT' ? otBooks : ntBooks;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          성경 목차
        </h2>
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('OT')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors rounded-l-lg ${
              activeTab === 'OT'
                ? 'bg-blue-600 text-white'
                : 'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            구약 ({otBooks.length})
          </button>
          <button
            onClick={() => setActiveTab('NT')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors rounded-r-lg ${
              activeTab === 'NT'
                ? 'bg-blue-600 text-white'
                : 'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            신약 ({ntBooks.length})
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/${defaultVersion}/${book.id}/1`}
            className="group rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600 dark:hover:bg-blue-950"
          >
            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-400">
              {book.nameKo}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {book.chapters}장
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

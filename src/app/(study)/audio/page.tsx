'use client';

import AudioPageClient from './AudioPageClient';
import { BIBLE_BOOKS, SUPPORTED_VERSIONS } from '@/lib/constants';

export default function AudioPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
        오디오 성경
      </h1>
      <AudioPageClient books={BIBLE_BOOKS} versions={SUPPORTED_VERSIONS} />
    </div>
  );
}

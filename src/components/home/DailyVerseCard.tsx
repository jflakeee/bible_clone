'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useHistoryStore } from '@/stores/historyStore';
import { BIBLE_BOOKS, SUPPORTED_VERSIONS } from '@/lib/constants';

// Curated list of well-known verses for daily verse
const DAILY_VERSES = [
  { bookId: 1, chapter: 1, verse: 1, reference: '창세기 1:1', text: '태초에 하나님이 천지를 창조하시니라' },
  { bookId: 19, chapter: 23, verse: 1, reference: '시편 23:1', text: '여호와는 나의 목자시니 내가 부족함이 없으리로다' },
  { bookId: 19, chapter: 119, verse: 105, reference: '시편 119:105', text: '주의 말씀은 내 발에 등이요 내 길에 빛이니이다' },
  { bookId: 20, chapter: 3, verse: 5, reference: '잠언 3:5', text: '너는 마음을 다하여 여호와를 의뢰하고 네 명철을 의지하지 말라' },
  { bookId: 23, chapter: 40, verse: 31, reference: '이사야 40:31', text: '오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리의 날개치며 올라감 같을 것이요' },
  { bookId: 24, chapter: 29, verse: 11, reference: '예레미야 29:11', text: '나 여호와가 너희를 향하여 품은 생각은 평안이요 재앙이 아니니라' },
  { bookId: 40, chapter: 11, verse: 28, reference: '마태복음 11:28', text: '수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라' },
  { bookId: 40, chapter: 28, verse: 20, reference: '마태복음 28:20', text: '볼지어다 내가 세상 끝날까지 너희와 항상 함께 있으리라' },
  { bookId: 43, chapter: 3, verse: 16, reference: '요한복음 3:16', text: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 저를 믿는 자마다 멸망치 않고 영생을 얻게 하려 하심이니라' },
  { bookId: 43, chapter: 14, verse: 6, reference: '요한복음 14:6', text: '예수께서 가라사대 내가 곧 길이요 진리요 생명이니 나로 말미암지 않고는 아버지께로 올 자가 없느니라' },
  { bookId: 45, chapter: 8, verse: 28, reference: '로마서 8:28', text: '우리가 알거니와 하나님을 사랑하는 자 곧 그 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라' },
  { bookId: 50, chapter: 4, verse: 13, reference: '빌립보서 4:13', text: '내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라' },
  { bookId: 58, chapter: 11, verse: 1, reference: '히브리서 11:1', text: '믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니' },
  { bookId: 62, chapter: 4, verse: 8, reference: '요한일서 4:8', text: '사랑하지 아니하는 자는 하나님을 알지 못하나니 이는 하나님은 사랑이심이라' },
  { bookId: 19, chapter: 46, verse: 1, reference: '시편 46:1', text: '하나님은 우리의 피난처시요 힘이시니 환난 중에 만날 큰 도움이시라' },
  { bookId: 19, chapter: 27, verse: 1, reference: '시편 27:1', text: '여호와는 나의 빛이요 나의 구원이시니 내가 누구를 두려워하리요' },
  { bookId: 23, chapter: 41, verse: 10, reference: '이사야 41:10', text: '두려워 말라 내가 너와 함께 함이니라 놀라지 말라 나는 네 하나님이 됨이니라' },
  { bookId: 46, chapter: 13, verse: 4, reference: '고린도전서 13:4', text: '사랑은 오래 참고 사랑은 온유하며 시기하지 아니하며' },
  { bookId: 48, chapter: 5, verse: 22, reference: '갈라디아서 5:22', text: '오직 성령의 열매는 사랑과 희락과 화평과 오래 참음과 자비와 양선과 충성과' },
  { bookId: 49, chapter: 2, verse: 8, reference: '에베소서 2:8', text: '너희가 그 은혜를 인하여 믿음으로 말미암아 구원을 얻었나니 이것이 너희에게서 난 것이 아니요 하나님의 선물이라' },
];

function getDailyVerseIndex(): number {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((today.getTime() - start.getTime()) / 86400000);
  return dayOfYear % DAILY_VERSES.length;
}

export default function DailyVerseCard() {
  const { dailyVerse, setDailyVerse } = useHistoryStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const today = new Date().toISOString().split('T')[0];
    if (!dailyVerse || dailyVerse.date !== today) {
      const idx = getDailyVerseIndex();
      const v = DAILY_VERSES[idx];
      setDailyVerse({
        verse: v.verse,
        text: v.text,
        reference: v.reference,
        date: today,
      });
    }
  }, [dailyVerse, setDailyVerse]);

  if (!mounted || !dailyVerse) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg animate-pulse">
        <div className="h-6 w-32 bg-white/20 rounded mb-4" />
        <div className="h-16 bg-white/20 rounded mb-4" />
        <div className="h-4 w-24 bg-white/20 rounded" />
      </div>
    );
  }

  // Find book info for link
  const verseData = DAILY_VERSES[getDailyVerseIndex()];
  const book = BIBLE_BOOKS.find((b) => b.id === verseData.bookId);
  const defaultVersion = SUPPORTED_VERSIONS[0].id;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
      <div className="mb-1 flex items-center gap-2 text-blue-200">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <span className="text-sm font-medium">오늘의 말씀</span>
      </div>
      <blockquote className="my-4 text-lg font-serif leading-relaxed">
        &ldquo;{dailyVerse.text}&rdquo;
      </blockquote>
      <p className="mb-4 text-sm text-blue-200">- {dailyVerse.reference}</p>
      <div className="flex gap-3">
        {book && (
          <Link
            href={`/${defaultVersion}/${book.id}/${verseData.chapter}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            읽기
          </Link>
        )}
        <Link
          href="/audio"
          className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          듣기
        </Link>
      </div>
    </div>
  );
}

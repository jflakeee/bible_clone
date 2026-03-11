import type { Metadata } from 'next';
import { Noto_Serif_KR, Geist } from 'next/font/google';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const notoSerifKR = Noto_Serif_KR({
  variable: '--font-noto-serif-kr',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: '성경 읽기',
  description: '온라인 성경 읽기 - 개역한글, KJV, WEB',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${notoSerifKR.variable} font-sans antialiased`}
      >
        <Header />
        <main>{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}

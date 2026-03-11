import BibleChapterClient from './BibleChapterClient';
import { BIBLE_BOOKS, SUPPORTED_VERSIONS } from '@/lib/constants';

// Generate a reasonable set of static pages for common entry points.
// All other paths will be handled via client-side navigation.
// For direct URL access to non-generated paths, configure your hosting
// platform to serve the 404.html or index.html as a fallback.
export function generateStaticParams() {
  const params: { params: string[] }[] = [];
  const versions = SUPPORTED_VERSIONS.map((v) => v.id);

  for (const version of versions) {
    // Generate first chapter of each book
    for (const book of BIBLE_BOOKS) {
      params.push({ params: [version, String(book.id), '1'] });
    }
  }

  return params;
}

export default function BibleChapterPage() {
  return <BibleChapterClient />;
}

import SermonDetailClient from './SermonDetailClient';

// Generate all 40 sermon IDs for static export
export function generateStaticParams() {
  return Array.from({ length: 40 }, (_, i) => ({ id: String(i + 1) }));
}

export default function SermonDetailPage() {
  return <SermonDetailClient />;
}

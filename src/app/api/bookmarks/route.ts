import { NextResponse } from 'next/server';

// Placeholder API route for bookmarks
// Currently bookmarks are stored client-side via Zustand persist (localStorage)
// This route will be replaced with Supabase integration in the future

export async function GET() {
  return NextResponse.json({
    message: 'Bookmarks are currently stored client-side. This endpoint is a placeholder for future Supabase integration.',
    bookmarks: [],
  });
}

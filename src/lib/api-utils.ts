import { NextResponse } from 'next/server';

/**
 * Standard API response helpers.
 *
 * Success: { data: T }
 * Error:   { error: { code: string, message: string } }
 */

/** Return a successful JSON response with standard { data } envelope. */
export function apiSuccess<T>(
  data: T,
  init?: { status?: number; headers?: Record<string, string> },
): NextResponse {
  return NextResponse.json(
    { data },
    {
      status: init?.status ?? 200,
      headers: init?.headers,
    },
  );
}

/** Return a standard error JSON response. */
export function apiError(
  code: string,
  message: string,
  status: number = 500,
): NextResponse {
  return NextResponse.json(
    {
      error: {
        code,
        message,
      },
    },
    { status },
  );
}

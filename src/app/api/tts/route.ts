import { NextRequest, NextResponse } from 'next/server';
import { apiError } from '@/lib/api-utils';

/**
 * TTS API Route
 *
 * POST /api/tts
 * Body: { text: string, language: string, speed: number }
 *
 * For MVP: returns guidance to use browser TTS when no Google API key is configured.
 * When GOOGLE_TTS_API_KEY is set, proxies requests to Google Cloud Text-to-Speech API.
 */

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 30; // requests per window
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// Google Cloud TTS language code mapping
const GOOGLE_LANGUAGE_MAP: Record<string, string> = {
  'ko-KR': 'ko-KR',
  'en-US': 'en-US',
  'en-GB': 'en-GB',
  'ja-JP': 'ja-JP',
  'zh-CN': 'cmn-CN',
  'zh-TW': 'cmn-TW',
  'es-ES': 'es-ES',
  'fr-FR': 'fr-FR',
  'de-DE': 'de-DE',
  'he-IL': 'he-IL',
  'el-GR': 'el-GR',
};

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(ip)) {
    return apiError(
      'RATE_LIMITED',
      '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
      429,
    );
  }

  let body: { text?: string; language?: string; speed?: number };
  try {
    body = await request.json();
  } catch {
    return apiError('INVALID_REQUEST', '잘못된 요청 형식입니다.', 400);
  }

  const { text, language = 'ko-KR', speed = 1.0 } = body;

  if (!text || typeof text !== 'string') {
    return apiError('MISSING_TEXT', '텍스트가 필요합니다.', 400);
  }

  if (text.length > 5000) {
    return apiError('TEXT_TOO_LONG', '텍스트가 너무 깁니다 (최대 5000자).', 400);
  }

  const apiKey = process.env.GOOGLE_TTS_API_KEY;

  if (!apiKey) {
    return apiError(
      'SERVICE_UNAVAILABLE',
      'Google Cloud TTS API 키가 설정되지 않았습니다. 브라우저 TTS를 사용해주세요.',
      503,
    );
  }

  // Google Cloud Text-to-Speech API
  try {
    const googleLang = GOOGLE_LANGUAGE_MAP[language] || language;

    const googleResponse = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: googleLang,
            ssmlGender: 'NEUTRAL',
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: speed,
          },
        }),
      }
    );

    if (!googleResponse.ok) {
      const errorData = await googleResponse.json().catch(() => ({}));
      console.error('Google TTS API error:', errorData);
      return apiError(
        'UPSTREAM_ERROR',
        'Google TTS API 오류가 발생했습니다.',
        502,
      );
    }

    const data = await googleResponse.json();
    const audioContent = data.audioContent; // base64 encoded

    // Convert base64 to binary
    const binaryString = atob(audioContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new NextResponse(bytes, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return apiError('INTERNAL_ERROR', 'TTS 처리 중 오류가 발생했습니다.', 500);
  }
}

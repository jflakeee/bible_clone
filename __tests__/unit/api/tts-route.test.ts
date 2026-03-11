/**
 * Tests for /api/tts route handler
 * @jest-environment node
 */

import { POST } from '@/app/api/tts/route';
import { NextRequest } from 'next/server';

// Mock api-utils
jest.mock('@/lib/api-utils', () => ({
  apiError: jest.fn((code: string, message: string, status: number) => {
    return new Response(JSON.stringify({ error: { code, message } }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }),
}));

// Store original env
const originalEnv = process.env;

function createRequest(body: unknown, headers: Record<string, string> = {}): NextRequest {
  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  return new NextRequest(new URL('http://localhost:3000/api/tts'), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: reqHeaders,
  });
}

describe('POST /api/tts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset env
    process.env = { ...originalEnv };
    delete process.env.GOOGLE_TTS_API_KEY;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns 503 when GOOGLE_TTS_API_KEY is not set', async () => {
    const req = createRequest({ text: 'Hello', language: 'ko-KR' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.error.code).toBe('SERVICE_UNAVAILABLE');
  });

  it('returns 400 when text is missing', async () => {
    const req = createRequest({ language: 'ko-KR' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('MISSING_TEXT');
  });

  it('returns 400 when text is empty string', async () => {
    const req = createRequest({ text: '', language: 'ko-KR' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('MISSING_TEXT');
  });

  it('returns 400 when text is not a string', async () => {
    const req = createRequest({ text: 123, language: 'ko-KR' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('MISSING_TEXT');
  });

  it('returns 400 when text exceeds 5000 characters', async () => {
    const longText = 'a'.repeat(5001);
    const req = createRequest({ text: longText, language: 'ko-KR' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('TEXT_TOO_LONG');
  });

  it('accepts text at exactly 5000 characters', async () => {
    // With no API key, it will return 503 (not TEXT_TOO_LONG)
    const text = 'a'.repeat(5000);
    const req = createRequest({ text, language: 'ko-KR' });
    const res = await POST(req);
    const body = await res.json();

    expect(body.error.code).not.toBe('TEXT_TOO_LONG');
  });

  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest(new URL('http://localhost:3000/api/tts'), {
      method: 'POST',
      body: 'not json',
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error.code).toBe('INVALID_REQUEST');
  });

  it('calls Google TTS API when key is configured', async () => {
    process.env.GOOGLE_TTS_API_KEY = 'test-api-key';

    const mockAudioContent = btoa('fake-audio-content');
    const mockGoogleResponse = {
      ok: true,
      json: () => Promise.resolve({ audioContent: mockAudioContent }),
    };

    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue(mockGoogleResponse);

    try {
      const req = createRequest({ text: 'Hello world', language: 'ko-KR', speed: 1.0 });
      const res = await POST(req);

      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('audio/mpeg');
      expect(res.headers.get('Cache-Control')).toBe('public, max-age=86400');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('texttospeech.googleapis.com'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('ko-KR'),
        }),
      );
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('maps language codes correctly for Google TTS', async () => {
    process.env.GOOGLE_TTS_API_KEY = 'test-api-key';

    const mockAudioContent = btoa('audio');
    const mockGoogleResponse = {
      ok: true,
      json: () => Promise.resolve({ audioContent: mockAudioContent }),
    };

    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue(mockGoogleResponse);

    try {
      const req = createRequest({ text: 'Test', language: 'zh-CN', speed: 1.0 });
      await POST(req);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const fetchBody = JSON.parse(fetchCall[1].body);
      expect(fetchBody.voice.languageCode).toBe('cmn-CN');
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('returns 502 when Google TTS API returns error', async () => {
    process.env.GOOGLE_TTS_API_KEY = 'test-api-key';

    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: { message: 'Quota exceeded' } }),
    });

    try {
      const req = createRequest({ text: 'Hello', language: 'ko-KR' });
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(502);
      expect(body.error.code).toBe('UPSTREAM_ERROR');
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('returns 500 when Google TTS API throws', async () => {
    process.env.GOOGLE_TTS_API_KEY = 'test-api-key';

    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    try {
      const req = createRequest({ text: 'Hello', language: 'ko-KR' });
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body.error.code).toBe('INTERNAL_ERROR');
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('uses default language ko-KR when not provided', async () => {
    process.env.GOOGLE_TTS_API_KEY = 'test-api-key';

    const mockAudioContent = btoa('audio');
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ audioContent: mockAudioContent }),
    });

    try {
      const req = createRequest({ text: 'Test' });
      await POST(req);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const fetchBody = JSON.parse(fetchCall[1].body);
      expect(fetchBody.voice.languageCode).toBe('ko-KR');
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('uses default speed 1.0 when not provided', async () => {
    process.env.GOOGLE_TTS_API_KEY = 'test-api-key';

    const mockAudioContent = btoa('audio');
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ audioContent: mockAudioContent }),
    });

    try {
      const req = createRequest({ text: 'Test' });
      await POST(req);

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const fetchBody = JSON.parse(fetchCall[1].body);
      expect(fetchBody.audioConfig.speakingRate).toBe(1.0);
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('rate limits after too many requests from same IP', async () => {
    // We need to send 31 requests (RATE_LIMIT_MAX=30) to trigger rate limiting
    // Each request from the same IP (based on x-forwarded-for header)
    const results: Response[] = [];

    for (let i = 0; i <= 30; i++) {
      const req = createRequest(
        { text: 'Hello' },
        { 'x-forwarded-for': '192.168.1.100' },
      );
      results.push(await POST(req));
    }

    // The 31st request should be rate limited
    const lastRes = results[results.length - 1];
    const body = await lastRes.json();

    expect(lastRes.status).toBe(429);
    expect(body.error.code).toBe('RATE_LIMITED');
  });
});

import { test, expect } from '@playwright/test';

test.describe('TTS API Route', () => {
  test('TTS API route (/api/tts) responds to POST', async ({ request }) => {
    const response = await request.post('/api/tts', {
      data: {
        text: '태초에 하나님이 천지를 창조하시니라',
        language: 'ko-KR',
        speed: 1.0,
      },
    });
    // Should respond (either 503 without API key, or 200 with key)
    expect([200, 503]).toContain(response.status());
  });

  test('returns error without Google API key (expected behavior)', async ({
    request,
  }) => {
    const response = await request.post('/api/tts', {
      data: {
        text: 'Test text',
        language: 'ko-KR',
        speed: 1.0,
      },
    });
    // Without API key configured, expect 503 with browser suggestion
    if (response.status() === 503) {
      const body = await response.json();
      expect(body.suggestion).toBe('browser');
      expect(body.error).toContain('API 키가 설정되지 않았습니다');
    }
    // If 200, the API key is set - that's fine too
  });

  test('returns 400 for missing text', async ({ request }) => {
    const response = await request.post('/api/tts', {
      data: {
        language: 'ko-KR',
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('텍스트가 필요합니다');
  });

  test('returns 400 for invalid request format', async ({ request }) => {
    const response = await request.post('/api/tts', {
      data: 'not json',
      headers: { 'Content-Type': 'text/plain' },
    });
    expect(response.status()).toBe(400);
  });
});

/**
 * Tests for src/lib/api-utils.ts
 * @jest-environment node
 */

import { apiSuccess, apiError } from '@/lib/api-utils';

describe('apiSuccess', () => {
  it('returns 200 status by default', async () => {
    const res = apiSuccess({ message: 'ok' });

    expect(res.status).toBe(200);
  });

  it('wraps data in { data } envelope', async () => {
    const payload = { items: [1, 2, 3], total: 3 };
    const res = apiSuccess(payload);
    const body = await res.json();

    expect(body).toEqual({ data: payload });
  });

  it('accepts custom status code', async () => {
    const res = apiSuccess({ created: true }, { status: 201 });

    expect(res.status).toBe(201);
  });

  it('sets custom headers', async () => {
    const res = apiSuccess({ test: true }, {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    });

    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600');
  });

  it('returns JSON content type', async () => {
    const res = apiSuccess('test');

    expect(res.headers.get('content-type')).toContain('application/json');
  });

  it('handles null data', async () => {
    const res = apiSuccess(null);
    const body = await res.json();

    expect(body).toEqual({ data: null });
  });

  it('handles array data', async () => {
    const arr = [{ id: 1 }, { id: 2 }];
    const res = apiSuccess(arr);
    const body = await res.json();

    expect(body).toEqual({ data: arr });
  });

  it('handles empty object data', async () => {
    const res = apiSuccess({});
    const body = await res.json();

    expect(body).toEqual({ data: {} });
  });

  it('handles string data', async () => {
    const res = apiSuccess('hello');
    const body = await res.json();

    expect(body).toEqual({ data: 'hello' });
  });

  it('uses default status 200 when init has no status', async () => {
    const res = apiSuccess('data', { headers: { 'X-Custom': 'value' } });

    expect(res.status).toBe(200);
  });
});

describe('apiError', () => {
  it('returns the specified status code', async () => {
    const res = apiError('NOT_FOUND', 'Resource not found', 404);

    expect(res.status).toBe(404);
  });

  it('wraps error in { error: { code, message } } envelope', async () => {
    const res = apiError('BAD_REQUEST', 'Invalid input', 400);
    const body = await res.json();

    expect(body).toEqual({
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid input',
      },
    });
  });

  it('defaults to 500 status when no status provided', async () => {
    const res = apiError('INTERNAL_ERROR', 'Something went wrong');

    expect(res.status).toBe(500);
  });

  it('returns JSON content type', async () => {
    const res = apiError('ERROR', 'msg', 500);

    expect(res.headers.get('content-type')).toContain('application/json');
  });

  it('handles various HTTP status codes', async () => {
    const cases = [
      { status: 400, code: 'BAD_REQUEST' },
      { status: 401, code: 'UNAUTHORIZED' },
      { status: 403, code: 'FORBIDDEN' },
      { status: 404, code: 'NOT_FOUND' },
      { status: 429, code: 'RATE_LIMITED' },
      { status: 500, code: 'INTERNAL_ERROR' },
      { status: 502, code: 'BAD_GATEWAY' },
      { status: 503, code: 'SERVICE_UNAVAILABLE' },
    ];

    for (const { status, code } of cases) {
      const res = apiError(code, 'test', status);
      const body = await res.json();

      expect(res.status).toBe(status);
      expect(body.error.code).toBe(code);
    }
  });

  it('preserves Korean error messages', async () => {
    const res = apiError('FETCH_FAILED', '성경 데이터를 불러오는 데 실패했습니다.', 500);
    const body = await res.json();

    expect(body.error.message).toBe('성경 데이터를 불러오는 데 실패했습니다.');
  });

  it('handles empty message string', async () => {
    const res = apiError('ERROR', '', 500);
    const body = await res.json();

    expect(body.error.message).toBe('');
  });
});

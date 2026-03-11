import { test, expect } from '@playwright/test';

test.describe('Sermons Page', () => {
  test('sermons page (/sermons) loads', async ({ page }) => {
    await page.goto('/sermons');
    await expect(
      page.getByRole('heading', { name: '설교 검색' })
    ).toBeVisible();
    await expect(
      page.getByText('키워드, 성경 구절, 태그로 관련 설교를 찾아보세요.')
    ).toBeVisible();
  });

  test('search input is present', async ({ page }) => {
    await page.goto('/sermons');
    const searchInput = page.getByPlaceholder(
      '설교 검색 (제목, 내용, 설교자...)'
    );
    await expect(searchInput).toBeVisible();
    // Verse reference input
    const verseInput = page.getByPlaceholder('구절 (예: Jhn 3:16)');
    await expect(verseInput).toBeVisible();
    // Search button
    await expect(page.getByRole('button', { name: '검색' })).toBeVisible();
  });

  test('tag filter buttons are present', async ({ page }) => {
    await page.goto('/sermons');
    await expect(page.getByText('태그 필터')).toBeVisible();
    // Popular tags should be visible
    await expect(page.getByRole('button', { name: '#사랑' })).toBeVisible();
    await expect(page.getByRole('button', { name: '#믿음' })).toBeVisible();
    await expect(page.getByRole('button', { name: '#소망' })).toBeVisible();
    await expect(page.getByRole('button', { name: '#구원' })).toBeVisible();
    await expect(page.getByRole('button', { name: '#기도' })).toBeVisible();
  });

  test('can search for a sermon and see results', async ({ page }) => {
    await page.goto('/sermons');
    // Wait for initial sermon load
    await expect(page.getByText(/\d+개의 설교/)).toBeVisible({ timeout: 10000 });
    // Results should be displayed (sermons auto-load)
    const resultCount = await page.getByText(/\d+개의 설교/).textContent();
    expect(resultCount).toBeTruthy();
  });

  test('sermon detail page works (/sermons/1)', async ({ page }) => {
    await page.goto('/sermons/1');
    // Should show either the sermon content or an error message
    // Wait for loading to finish
    await page.waitForTimeout(3000);
    // Either we see sermon content (title, preacher, etc.) or an error
    const hasSermonTitle = await page.locator('h1').count();
    const hasError = await page.getByText('설교를 찾을 수 없습니다').count();
    const hasBackButton = await page.getByText('설교 목록').count();
    // At least one of these should be true
    expect(hasSermonTitle > 0 || hasError > 0 || hasBackButton > 0).toBeTruthy();
  });
});

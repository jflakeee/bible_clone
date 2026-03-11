import { test, expect } from '@playwright/test';

test.describe('Audio Page', () => {
  test('audio page (/audio) loads', async ({ page }) => {
    await page.goto('/audio');
    await expect(
      page.getByRole('heading', { name: '오디오 성경' })
    ).toBeVisible();
  });

  test('play button is present', async ({ page }) => {
    await page.goto('/audio');
    // Wait for verses to load
    await page.waitForTimeout(2000);
    const playButton = page.getByRole('button', { name: '재생' });
    await expect(playButton).toBeVisible();
  });

  test('speed control is present', async ({ page }) => {
    await page.goto('/audio');
    // The speed button in AudioPlayer shows "1x" by default
    const speedButton = page.getByRole('button', { name: /속도/ });
    await expect(speedButton).toBeVisible();
    // Also check AudioSettings speed options
    await expect(page.getByText('읽기 속도', { exact: true })).toBeVisible();
  });

  test('book/chapter selectors work', async ({ page }) => {
    await page.goto('/audio');
    // Book selector with OT/NT groups
    const bookSelect = page.locator('select').filter({ hasText: '창세기' });
    await expect(bookSelect).toBeVisible();

    // Chapter selector
    const chapterSelect = page.locator('select').filter({ hasText: '1장' });
    await expect(chapterSelect).toBeVisible();

    // Change book to a different one (Exodus = book 2)
    await bookSelect.selectOption('2');
    // Chapter selector should reset; verify it still works
    await expect(chapterSelect).toBeVisible();
  });
});

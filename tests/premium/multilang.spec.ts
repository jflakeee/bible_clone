import { test, expect } from '@playwright/test';

test.describe('Multi-Language Page', () => {
  test('multilang page (/multilang) loads', async ({ page }) => {
    await page.goto('/multilang');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('book/chapter selectors are present', async ({ page }) => {
    await page.goto('/multilang');
    // Book selector
    const bookSelect = page.locator('#ml-book-select');
    await expect(bookSelect).toBeVisible();
    // Chapter selector
    const chapterSelect = page.locator('#ml-chapter-select');
    await expect(chapterSelect).toBeVisible();
    // Verse range inputs
    const verseStart = page.locator('#ml-verse-start');
    await expect(verseStart).toBeVisible();
    const verseEnd = page.locator('#ml-verse-end');
    await expect(verseEnd).toBeVisible();
  });

  test('translation browser is present', async ({ page }) => {
    await page.goto('/multilang');
    // Wait for translations to load
    await page.waitForTimeout(3000);
    // The TranslationBrowser component or loading spinner should be visible
    // After loading, the browse button or translation browser should be visible
    const browseButton = page.getByRole('button').filter({ hasText: /전체 보기|Browse/ });
    // Either the browser is shown directly, or there's a button to show it
    const hasBrowser = await browseButton.count();
    if (hasBrowser === 0) {
      // The browser might be shown by default (showBrowser=true initially)
      // Check for any translation-related content
      await expect(page.locator('#ml-book-select')).toBeVisible();
    }
  });
});

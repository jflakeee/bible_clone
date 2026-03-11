import { test, expect } from '@playwright/test';

test.describe('Translation Comparison', () => {
  test('compare page loads', async ({ page }) => {
    await page.goto('/compare');
    await expect(page.getByRole('heading', { name: '번역 비교' })).toBeVisible();
  });

  test('can select book, chapter, verse range', async ({ page }) => {
    await page.goto('/compare');
    // Book selector
    const bookSelect = page.locator('#book-select');
    await expect(bookSelect).toBeVisible();
    // Should have 66 book options
    const bookOptions = bookSelect.locator('option');
    await expect(bookOptions).toHaveCount(66);

    // Chapter selector
    const chapterSelect = page.locator('#chapter-select');
    await expect(chapterSelect).toBeVisible();

    // Verse start and end inputs
    const verseStart = page.locator('#verse-start');
    const verseEnd = page.locator('#verse-end');
    await expect(verseStart).toBeVisible();
    await expect(verseEnd).toBeVisible();

    // Change book to Exodus (출애굽기, id=2)
    await bookSelect.selectOption('2');
    // Chapter selector should update (Exodus has 40 chapters)
    const chapterOptions = chapterSelect.locator('option');
    await expect(chapterOptions).toHaveCount(40);
  });

  test('shows multiple translations side by side', async ({ page }) => {
    await page.goto('/compare');
    // Wait for compare results to load (default is Genesis 1:1-5 with krv and kjv)
    // The results section should show the selected book/chapter/verses
    const resultsHeading = page.getByRole('heading', { name: /창세기 1장 1-5절/ });
    await expect(resultsHeading).toBeVisible({ timeout: 15000 });
  });

  test('version toggle buttons work', async ({ page }) => {
    await page.goto('/compare');
    // Find the version toggle buttons
    const krvButton = page.getByRole('button', { name: '개역한글' });
    const kjvButton = page.getByRole('button', { name: 'King James Version' });
    const webButton = page.getByRole('button', { name: 'World English Bible' });

    await expect(krvButton).toBeVisible();
    await expect(kjvButton).toBeVisible();
    await expect(webButton).toBeVisible();

    // krv and kjv should be selected by default (have blue background)
    await expect(krvButton).toHaveClass(/bg-blue-600/);
    await expect(kjvButton).toHaveClass(/bg-blue-600/);
    // web should not be selected
    await expect(webButton).not.toHaveClass(/bg-blue-600/);

    // Toggle WEB on
    await webButton.click();
    await expect(webButton).toHaveClass(/bg-blue-600/);
  });

  test('compare results display correctly', async ({ page }) => {
    await page.goto('/compare');
    // Wait for results container
    const resultsContainer = page.locator('.bg-white.border.border-gray-200.rounded-lg.p-4').last();
    await expect(resultsContainer).toBeVisible({ timeout: 15000 });
    // Should have a heading with selected range
    const heading = resultsContainer.getByRole('heading');
    await expect(heading).toBeVisible();
  });
});

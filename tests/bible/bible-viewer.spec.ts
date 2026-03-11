import { test, expect } from '@playwright/test';

test.describe('Bible Viewer - Home Page', () => {
  test('home page loads with 66 books grid', async ({ page }) => {
    await page.goto('/');
    // The page should have the main heading
    await expect(page.getByRole('heading', { name: '성경 읽기' })).toBeVisible();
    // Should show all 66 books as links
    const bookLinks = page.locator('a[href*="/krv/"]');
    await expect(bookLinks).toHaveCount(66);
  });

  test('OT section shows 39 books', async ({ page }) => {
    await page.goto('/');
    // OT section heading includes count
    const otHeading = page.getByRole('heading', { name: /구약성경.*39권/ });
    await expect(otHeading).toBeVisible();
    // Count the links within the OT section
    const otSection = page.locator('section').first();
    const otBooks = otSection.locator('a[href*="/krv/"]');
    await expect(otBooks).toHaveCount(39);
  });

  test('NT section shows 27 books', async ({ page }) => {
    await page.goto('/');
    // NT section heading includes count
    const ntHeading = page.getByRole('heading', { name: /신약성경.*27권/ });
    await expect(ntHeading).toBeVisible();
    // Count the links within the NT section
    const ntSection = page.locator('section').nth(1);
    const ntBooks = ntSection.locator('a[href*="/krv/"]');
    await expect(ntBooks).toHaveCount(27);
  });

  test('click a book navigates to chapter 1', async ({ page }) => {
    await page.goto('/');
    // Click on Genesis (창세기)
    await page.getByText('창세기').first().click();
    // Should navigate to /krv/1/1
    await expect(page).toHaveURL(/\/krv\/1\/1/);
  });
});

test.describe('Bible Viewer - Chapter Page', () => {
  test('Bible chapter page shows verse text', async ({ page }) => {
    await page.goto('/krv/1/1');
    // Page should have a heading with the book name and chapter
    await expect(page.getByRole('heading', { name: /창세기 1장/ })).toBeVisible();
    // Should display verse numbers (superscript elements with verse numbers)
    const verseNumbers = page.locator('sup');
    // Genesis 1 has 31 verses, but we just check some exist
    const count = await verseNumbers.count();
    expect(count).toBeGreaterThan(0);
  });

  test('chapter navigation prev/next works', async ({ page }) => {
    await page.goto('/krv/1/2');
    // Should have prev and next navigation links
    const prevLink = page.getByRole('link', { name: /이전/ });
    const nextLink = page.getByRole('link', { name: /다음/ });
    await expect(prevLink).toBeVisible();
    await expect(nextLink).toBeVisible();
    // Click next should go to chapter 3
    await nextLink.click();
    await expect(page).toHaveURL(/\/krv\/1\/3/);
    // Click prev should go back to chapter 2
    const prevLinkAgain = page.getByRole('link', { name: /이전/ });
    await prevLinkAgain.click();
    await expect(page).toHaveURL(/\/krv\/1\/2/);
  });

  test('version selector shows options', async ({ page }) => {
    await page.goto('/krv/1/1');
    // The version selector is a <select> element
    const versionSelect = page.locator('select');
    await expect(versionSelect).toBeVisible();
    // Check it has the expected options
    const options = versionSelect.locator('option');
    const optionTexts = await options.allTextContents();
    expect(optionTexts).toContain('개역한글');
    expect(optionTexts).toContain('King James Version');
    expect(optionTexts).toContain('World English Bible');
  });

  test('verse numbers are displayed', async ({ page }) => {
    await page.goto('/krv/1/1');
    // Verse numbers are rendered as <sup> elements
    const firstVerse = page.locator('sup').first();
    await expect(firstVerse).toBeVisible();
    // First verse number should be "1"
    await expect(firstVerse).toHaveText('1');
  });

  test('page title includes book name', async ({ page }) => {
    await page.goto('/krv/1/1');
    // The metadata title should include the book name
    await expect(page).toHaveTitle(/창세기/);
  });
});

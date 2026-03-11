import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('search page loads with search input', async ({ page }) => {
    await page.goto('/search');
    await expect(page.getByRole('heading', { name: '성경 검색' })).toBeVisible();
    // Search input should be present
    const searchInput = page.getByPlaceholder('성경 구절 검색...');
    await expect(searchInput).toBeVisible();
  });

  test('can type a query and see results', async ({ page }) => {
    await page.goto('/search');
    const searchInput = page.getByPlaceholder('성경 구절 검색...');
    await searchInput.fill('사랑');
    // Click the search button
    await page.getByRole('button', { name: '검색' }).click();
    // Wait for results to appear
    const resultsList = page.locator('ul');
    await expect(resultsList).toBeVisible({ timeout: 15000 });
    // Should show result count
    const resultCount = page.getByText(/개의 결과를 찾았습니다/);
    await expect(resultCount).toBeVisible({ timeout: 15000 });
  });

  test('results show book name, chapter:verse', async ({ page }) => {
    await page.goto('/search');
    const searchInput = page.getByPlaceholder('성경 구절 검색...');
    await searchInput.fill('사랑');
    await page.getByRole('button', { name: '검색' }).click();
    // Wait for results
    await expect(page.getByText(/개의 결과를 찾았습니다/)).toBeVisible({ timeout: 15000 });
    // Each result should have a book name with chapter:verse pattern
    const firstResult = page.locator('ul li').first();
    await expect(firstResult).toBeVisible();
    // Should contain text matching "BookName Chapter:Verse" pattern
    const referenceText = firstResult.locator('.text-blue-700');
    await expect(referenceText).toBeVisible();
    const text = await referenceText.textContent();
    // Should match pattern like "요한일서 4:8" (BookName Chapter:Verse)
    expect(text).toMatch(/\S+\s+\d+:\d+/);
  });

  test('filter by version works', async ({ page }) => {
    await page.goto('/search');
    // Version filter should be present
    const versionFilter = page.locator('#version-filter');
    await expect(versionFilter).toBeVisible();
    // Should have the expected options
    const options = versionFilter.locator('option');
    const optionTexts = await options.allTextContents();
    expect(optionTexts).toContain('개역한글');
    expect(optionTexts).toContain('King James Version');
    expect(optionTexts).toContain('World English Bible');
    // Change to KJV
    await versionFilter.selectOption('kjv');
    // The filter should now show kjv selected
    await expect(versionFilter).toHaveValue('kjv');
  });

  test('filter by testament works', async ({ page }) => {
    await page.goto('/search');
    // Testament filter should be present
    const testamentFilter = page.locator('#testament-filter');
    await expect(testamentFilter).toBeVisible();
    // Should have the expected options
    const options = testamentFilter.locator('option');
    const optionTexts = await options.allTextContents();
    expect(optionTexts).toContain('전체');
    expect(optionTexts).toContain('구약');
    expect(optionTexts).toContain('신약');
    // Change to NT only
    await testamentFilter.selectOption('nt');
    await expect(testamentFilter).toHaveValue('nt');
  });

  test('empty search shows no results', async ({ page }) => {
    await page.goto('/search');
    // Initially, no results list should be visible
    const resultsList = page.locator('ul');
    await expect(resultsList).not.toBeVisible();
    // The result count text should not be visible
    const resultCount = page.getByText(/개의 결과를 찾았습니다/);
    await expect(resultCount).not.toBeVisible();
  });
});

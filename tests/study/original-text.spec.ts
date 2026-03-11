import { test, expect } from '@playwright/test';

test.describe('Original Text Page', () => {
  test('original text page (/original) loads', async ({ page }) => {
    await page.goto('/original');
    await expect(page.getByRole('heading', { name: '원어 성경' })).toBeVisible();
    await expect(
      page.getByText('히브리어/헬라어 원문을 단어별 분석과 함께 볼 수 있습니다')
    ).toBeVisible();
  });

  test('book selector has OT and NT options', async ({ page }) => {
    await page.goto('/original');
    const bookSelect = page.locator('#book-select');
    await expect(bookSelect).toBeVisible();
    // Check OT optgroup exists
    const otGroup = bookSelect.locator('optgroup[label*="구약"]');
    await expect(otGroup).toHaveCount(1);
    // Check NT optgroup exists
    const ntGroup = bookSelect.locator('optgroup[label*="신약"]');
    await expect(ntGroup).toHaveCount(1);
    // OT should have 39 books
    const otOptions = otGroup.locator('option');
    await expect(otOptions).toHaveCount(39);
    // NT should have 27 books
    const ntOptions = ntGroup.locator('option');
    await expect(ntOptions).toHaveCount(27);
  });

  test('shows language indicator (히브리어/헬라어)', async ({ page }) => {
    await page.goto('/original');
    // Default is Genesis (OT) so should show Hebrew indicator
    await expect(page.getByText('구약 - 히브리어 (Hebrew, RTL)')).toBeVisible();

    // Select an NT book (e.g., Matthew = book 40)
    const bookSelect = page.locator('#book-select');
    await bookSelect.selectOption('40');
    // Should now show Greek indicator
    await expect(page.getByText('신약 - 헬라어 (Greek, LTR)')).toBeVisible();
  });
});

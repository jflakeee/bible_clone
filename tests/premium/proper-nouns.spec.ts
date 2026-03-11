import { test, expect } from '@playwright/test';

test.describe('Proper Nouns Page', () => {
  test('proper nouns page (/proper-nouns) loads', async ({ page }) => {
    await page.goto('/proper-nouns');
    await expect(
      page.getByRole('heading', { name: '성경 고유명사' })
    ).toBeVisible();
    await expect(
      page.getByText(
        '성경에 등장하는 주요 인물, 장소, 물건, 칭호, 지파, 민족을 찾아보세요.'
      )
    ).toBeVisible();
  });

  test('type filter buttons are present', async ({ page }) => {
    await page.goto('/proper-nouns');
    // Type filter buttons are rounded-full border buttons
    const filterSection = page.locator('.flex.flex-wrap.gap-2').first();
    await expect(filterSection.getByRole('button', { name: '전체', exact: true })).toBeVisible();
    await expect(filterSection.getByRole('button', { name: '인물', exact: true })).toBeVisible();
    await expect(filterSection.getByRole('button', { name: '장소', exact: true })).toBeVisible();
    await expect(filterSection.getByRole('button', { name: '물건', exact: true })).toBeVisible();
    await expect(filterSection.getByRole('button', { name: '칭호', exact: true })).toBeVisible();
    await expect(filterSection.getByRole('button', { name: '지파', exact: true })).toBeVisible();
    await expect(filterSection.getByRole('button', { name: '민족', exact: true })).toBeVisible();
  });

  test('search input works', async ({ page }) => {
    await page.goto('/proper-nouns');
    const searchInput = page.getByPlaceholder('이름으로 검색... (한글/영어)');
    await expect(searchInput).toBeVisible();

    // Type a search query
    await searchInput.fill('Abraham');
    // Wait for filtering
    await page.waitForTimeout(500);
    // Results count should update
    const countText = page.getByText(/\d+개 항목/);
    await expect(countText).toBeVisible();
  });

  test('shows proper noun cards', async ({ page }) => {
    await page.goto('/proper-nouns');
    // Should show noun cards in grid view (default)
    // Each card is a button element with noun info
    const cards = page.locator(
      'button.rounded-xl'
    );
    // Should have multiple proper noun cards
    await expect(cards.first()).toBeVisible({ timeout: 5000 });
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Item count should be displayed
    const itemCount = page.getByText(/\d+개 항목/);
    await expect(itemCount).toBeVisible();
  });
});

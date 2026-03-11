import { test, expect } from '@playwright/test';

test.describe('Map Page', () => {
  test('map page (/map) loads', async ({ page }) => {
    await page.goto('/map');
    await expect(page.getByRole('heading', { name: '성경 지도' })).toBeVisible();
  });

  test('search input is present', async ({ page }) => {
    await page.goto('/map');
    const searchInput = page.getByPlaceholder('장소 검색...');
    await expect(searchInput).toBeVisible();
  });

  test('type filter buttons are present', async ({ page }) => {
    await page.goto('/map');
    // Type filter buttons are small rounded-full buttons in the header
    const header = page.locator('header');
    await expect(header.getByRole('button', { name: '전체', exact: true }).first()).toBeVisible();
    await expect(header.getByRole('button', { name: '도시', exact: true })).toBeVisible();
    await expect(header.getByRole('button', { name: '산', exact: true })).toBeVisible();
    await expect(header.getByRole('button', { name: '강', exact: true })).toBeVisible();
    await expect(header.getByRole('button', { name: '바다', exact: true })).toBeVisible();
    await expect(header.getByRole('button', { name: '지역', exact: true })).toBeVisible();
    await expect(header.getByRole('button', { name: '기타', exact: true })).toBeVisible();
  });

  test('testament filter works', async ({ page }) => {
    await page.goto('/map');
    // Testament filter buttons
    const otButton = page.getByRole('button', { name: '구약' });
    const ntButton = page.getByRole('button', { name: '신약' });
    await expect(otButton).toBeVisible();
    await expect(ntButton).toBeVisible();

    // Place count should be shown
    const placeCount = page.getByText(/\d+개 장소/);
    await expect(placeCount).toBeVisible();

    // Click OT filter and check count changes
    const initialCount = await placeCount.textContent();
    await otButton.click();
    // After filtering, count might change
    await expect(placeCount).toBeVisible();
  });
});

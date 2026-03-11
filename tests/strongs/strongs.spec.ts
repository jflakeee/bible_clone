import { test, expect } from '@playwright/test';

test.describe("Strong's Dictionary", () => {
  test("Strong's page loads", async ({ page }) => {
    await page.goto('/strongs');
    await expect(
      page.getByRole('heading', { name: "Strong's Concordance" })
    ).toBeVisible();
    // Search input should be present
    const searchInput = page.getByPlaceholder(/Strong's number/);
    await expect(searchInput).toBeVisible();
    // Search button should be present
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
  });

  test('can search by number (H1)', async ({ page }) => {
    await page.goto('/strongs');
    const searchInput = page.getByPlaceholder(/Strong's number/);
    await searchInput.fill('H1');
    await page.getByRole('button', { name: 'Search' }).click();
    // Wait for results
    const resultText = page.getByText(/result.*found/);
    await expect(resultText).toBeVisible({ timeout: 15000 });
    // Should show at least one entry with the Strong's number
    const entryNumber = page.locator('text=H1').first();
    await expect(entryNumber).toBeVisible();
  });

  test('can search by keyword', async ({ page }) => {
    await page.goto('/strongs');
    const searchInput = page.getByPlaceholder(/Strong's number/);
    await searchInput.fill('love');
    await page.getByRole('button', { name: 'Search' }).click();
    // Wait for results
    const resultText = page.getByText(/result.*found/);
    await expect(resultText).toBeVisible({ timeout: 15000 });
  });

  test("results show Strong's entries with expected fields", async ({ page }) => {
    await page.goto('/strongs');
    const searchInput = page.getByPlaceholder(/Strong's number/);
    await searchInput.fill('H430');
    await page.getByRole('button', { name: 'Search' }).click();
    // Wait for results
    const resultText = page.getByText(/result.*found/);
    await expect(resultText).toBeVisible({ timeout: 15000 });
    // Each entry should show the Strong's number badge
    const numberBadge = page.locator('.bg-blue-100').first();
    await expect(numberBadge).toBeVisible();
    // Should show language indicator (Hebrew or Greek)
    const languageBadge = page.locator('.bg-gray-100').first();
    await expect(languageBadge).toBeVisible();
    const languageText = await languageBadge.textContent();
    expect(languageText).toMatch(/Hebrew|Greek/);
  });

  test('entry shows lemma, transliteration, definition', async ({ page }) => {
    await page.goto('/strongs');
    const searchInput = page.getByPlaceholder(/Strong's number/);
    await searchInput.fill('G26');
    await page.getByRole('button', { name: 'Search' }).click();
    // Wait for results
    const resultText = page.getByText(/result.*found/);
    await expect(resultText).toBeVisible({ timeout: 15000 });
    // The entry button should exist
    const entryButton = page.locator('button.w-full').first();
    await expect(entryButton).toBeVisible();
    // Should contain the number badge
    await expect(entryButton.locator('.bg-blue-100')).toBeVisible();
    // Should have a definition/short definition text
    const definitionText = entryButton.locator('.text-gray-700, .dark\\:text-gray-300').first();
    await expect(definitionText).toBeVisible();
    // Should have a lemma (the original language character)
    const lemma = entryButton.locator('.shrink-0');
    await expect(lemma).toBeVisible();
  });

  test('quick example buttons trigger search', async ({ page }) => {
    await page.goto('/strongs');
    // Click the "H1" quick example button
    const h1Button = page.locator('button', { hasText: 'H1' }).first();
    await h1Button.click();
    // Should populate the search input
    const searchInput = page.getByPlaceholder(/Strong's number/);
    await expect(searchInput).toHaveValue('H1');
    // Should show results
    const resultText = page.getByText(/result.*found/);
    await expect(resultText).toBeVisible({ timeout: 15000 });
  });
});

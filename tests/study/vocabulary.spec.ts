import { test, expect } from '@playwright/test';

test.describe('Vocabulary Page', () => {
  test('vocabulary page (/vocabulary) loads', async ({ page }) => {
    await page.goto('/vocabulary');
    await expect(page.getByRole('heading', { name: '단어장' })).toBeVisible();
  });

  test('shows empty state message when no words saved', async ({ page }) => {
    await page.goto('/vocabulary');
    await expect(page.getByText('저장된 단어가 없습니다.')).toBeVisible();
    await expect(
      page.getByText('성경을 읽으며 단어를 저장해보세요.')
    ).toBeVisible();
  });

  test('sort and filter controls are present', async ({ page }) => {
    await page.goto('/vocabulary');
    // Sort buttons
    await expect(page.getByRole('button', { name: '최신순' })).toBeVisible();
    await expect(page.getByRole('button', { name: '오래된순' })).toBeVisible();
    await expect(page.getByRole('button', { name: '알파벳순' })).toBeVisible();
    await expect(page.getByRole('button', { name: '복습횟수순' })).toBeVisible();
    await expect(page.getByRole('button', { name: '언어별' })).toBeVisible();

    // Filter buttons
    await expect(page.getByRole('button', { name: '전체' })).toBeVisible();
    await expect(page.getByRole('button', { name: '히브리어' })).toBeVisible();
    await expect(page.getByRole('button', { name: '헬라어' })).toBeVisible();
    await expect(page.getByRole('button', { name: '학습완료' })).toBeVisible();
    await expect(page.getByRole('button', { name: '미학습' })).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/React/);
});

test('check product listing', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
});

test('navigate to product detail page', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-testid="product-card"]').first().click();
  await expect(page).toHaveURL(/product/);
});

test('add product to cart', async ({ page }) => {
  await page.goto('/');

  await page.locator('[data-testid="add-to-cart"]').first().click();

  await page.locator('[data-testid="cart-icon"]').click();

  await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible();
});

test('filter by category', async ({ page }) => {
  await page.goto('/');

  const checkbox = page.locator('[data-testid^="category-"]').first();

  await checkbox.scrollIntoViewIfNeeded();
  await checkbox.click();

  await page.waitForURL(/categories=/);

  await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
});

test('pagination works', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-testid="next-page"]').click();
  await expect(page).toHaveURL(/page=2/);
});
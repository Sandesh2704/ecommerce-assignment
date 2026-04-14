import { test, expect } from '@playwright/test';

test('cart page loads with items', async ({ page }) => {
  await page.goto('/');

  // add item first
  await page.locator('[data-testid="add-to-cart"]').first().click();

  await page.locator('[data-testid="cart-icon"]').click();

  await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible();
});

test('increase and decrease quantity', async ({ page }) => {
  await page.goto('/');

  await page.locator('[data-testid="add-to-cart"]').first().click();
  await page.locator('[data-testid="cart-icon"]').click();

  const qty = page.locator('[data-testid="cart-qty"]').first();

  await page.locator('[data-testid="increase-cart-qty"]').first().click();
  await expect(qty).not.toHaveText('1');

  await page.locator('[data-testid="decrease-cart-qty"]').first().click();
});

test('remove item from cart', async ({ page }) => {
  await page.goto('/');

  await page.locator('[data-testid="add-to-cart"]').first().click();
  await page.locator('[data-testid="cart-icon"]').click();

  await page.locator('[data-testid="remove-item"]').first().click();

  await expect(page.locator('[data-testid="empty-cart"]')).toBeVisible();
});

test('empty cart state visible', async ({ page }) => {
  await page.goto('/cart');

  await expect(page.locator('[data-testid="empty-cart"]')).toBeVisible();
});
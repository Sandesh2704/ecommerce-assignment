import { test, expect } from '@playwright/test';

test('product detail page loads', async ({ page }) => {
  await page.goto('/product/46');

  await expect(page.locator('[data-testid="product-title"]')).toBeVisible();
});

test('quantity increment and decrement works', async ({ page }) => {
  await page.goto('/product/46');

  const qty = page.locator('[data-testid="quantity-value"]');

  await expect(qty).toHaveText('1');

  await page.locator('[data-testid="increase-qty"]').click();
  await expect(qty).toHaveText('2');

  await page.locator('[data-testid="decrease-qty"]').click();
  await expect(qty).toHaveText('1');
});

test('add to cart from product page', async ({ page }) => {
  await page.goto('/product/46');

  await expect(page.locator('[data-testid="product-title"]')).toBeVisible();

  const addBtn = page.locator('[data-testid="product-add-to-cart"]');

  await expect(addBtn).toBeVisible();
  await expect(addBtn).toBeEnabled();

  await addBtn.click();

  await page.locator('[data-testid="cart-icon"]').click();

  await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible();
});

test('switch tabs', async ({ page }) => {
  await page.goto('/product/46');

  await page.locator('[data-testid="tab-details"]').click();
  await expect(page.locator('[data-testid="tab-content"]')).toContainText('Product Details');

  await page.locator('[data-testid="tab-shipping"]').click();
  await expect(page.locator('[data-testid="tab-content"]')).toContainText('Shipping');
});

test('image navigation works', async ({ page }) => {
  await page.goto('/product/46');

  const gallery = page.locator('.group').first();
  await gallery.hover();

  const rightBtn = page.locator('[data-testid="image-right"]').last();

  await expect(rightBtn).toBeVisible();
  await rightBtn.click();
});


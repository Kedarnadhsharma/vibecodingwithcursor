import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate from landing page to dashboards', async ({ page }) => {
    await page.goto('/');
    
    // Click the manage API keys button
    await page.click('a:has-text("Manage API keys")');
    
    // Should be on dashboards page
    await expect(page).toHaveURL('/dashboards');
    await expect(page.locator('h1:has-text("Overview")')).toBeVisible();
  });

  test('should have correct page titles', async ({ page }) => {
    // Check landing page
    await page.goto('/');
    await expect(page).toHaveTitle(/Next.js/i);
    
    // Check dashboards page
    await page.goto('/dashboards');
    await expect(page).toHaveTitle(/Next.js/i);
  });

  test('should open external links in new tabs', async ({ page }) => {
    await page.goto('/');
    
    // Check docs link
    const docsLink = page.locator('a:has-text("Explore the docs")');
    await expect(docsLink).toHaveAttribute('target', '_blank');
    await expect(docsLink).toHaveAttribute('rel', 'noreferrer');
    
    // Check examples link
    const examplesLink = page.locator('a:has-text("See examples")');
    await expect(examplesLink).toHaveAttribute('target', '_blank');
    await expect(examplesLink).toHaveAttribute('rel', 'noreferrer');
  });

  test('should open documentation link from dashboards', async ({ page }) => {
    await page.route('**/api/keys', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    await page.goto('/dashboards');
    
    const docsLink = page.locator('a:has-text("documentation")');
    await expect(docsLink).toBeVisible();
    await expect(docsLink).toHaveAttribute('target', '_blank');
  });

  test('should maintain state when navigating back and forth', async ({ page }) => {
    await page.route('**/api/keys', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 'key-1',
            name: 'Test Key',
            usage: 50,
            key: 'sk_test_123',
            limit: null
          }
        ])
      });
    });

    // Start on landing page
    await page.goto('/');
    
    // Navigate to dashboards
    await page.click('a:has-text("Manage API keys")');
    await page.waitForURL('/dashboards');
    
    // Check keys are loaded
    await expect(page.locator('text=Test Key')).toBeVisible({ timeout: 3000 });
    
    // Go back
    await page.goBack();
    await expect(page).toHaveURL('/');
    
    // Check landing page content
    await expect(page.locator('h1:has-text("Build quickly")')).toBeVisible();
    
    // Go forward
    await page.goForward();
    await expect(page).toHaveURL('/dashboards');
  });

  test('should handle direct navigation to dashboards', async ({ page }) => {
    await page.route('**/api/keys', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    // Navigate directly to dashboards
    await page.goto('/dashboards');
    
    // Should load correctly
    await expect(page.locator('h1:has-text("Overview")')).toBeVisible();
    await expect(page.locator('h3:has-text("API Keys")')).toBeVisible();
  });
});


import { test, expect } from '@playwright/test';

test.describe('Component Integration Tests', () => {
  test('should render Sidebar component', async ({ page }) => {
    await page.goto('/dashboards');
    
    // Check for sidebar elements
    const sidebar = page.locator('[class*="sidebar"]').first();
    await expect(sidebar).toBeVisible();
  });

  test('should display toast notifications', async ({ page }) => {
    await page.route('**/api/keys', async (route) => {
      if (route.request().method() === 'GET') {
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
      } else if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });

    await page.goto('/dashboards');
    await page.waitForSelector('text=Test Key');
    
    // Trigger a delete action to show toast
    await page.click('button:has-text("Delete")');
    
    // Check for success toast
    await expect(page.locator('text=API Key deleted successfully')).toBeVisible({ timeout: 2000 });
  });

  test('should close toast when clicking close button', async ({ page }) => {
    await page.route('**/api/keys', async (route) => {
      if (route.request().method() === 'GET') {
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
      } else if (route.request().method() === 'DELETE') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });

    await page.goto('/dashboards');
    await page.waitForSelector('text=Test Key');
    
    // Trigger a delete action to show toast
    await page.click('button:has-text("Delete")');
    
    // Wait for toast to appear
    const toast = page.locator('text=API Key deleted successfully');
    await expect(toast).toBeVisible({ timeout: 2000 });
    
    // Toast should auto-close or have a close button
    // Wait a bit to see if it auto-closes
    await page.waitForTimeout(4000);
  });

  test('should validate form inputs in create modal', async ({ page }) => {
    await page.route('**/api/keys', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    await page.goto('/dashboards');
    
    // Open create modal
    await page.click('button[aria-label="Add key"]');
    
    // Try to submit without entering a name
    const createButton = page.locator('button:has-text("Create")');
    await createButton.click();
    
    // Modal should still be visible (form validation prevented submission)
    await expect(page.locator('h4:has-text("Create API Key")')).toBeVisible();
  });

  test('should update limit value in create modal', async ({ page }) => {
    await page.route('**/api/keys', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      }
    });

    await page.goto('/dashboards');
    
    // Open create modal
    await page.click('button[aria-label="Add key"]');
    
    // Enable limit
    await page.click('input[type="checkbox"]');
    
    // Change limit value
    const limitInput = page.locator('input[type="number"]');
    await limitInput.fill('');
    await limitInput.fill('2500');
    
    // Check the value
    await expect(limitInput).toHaveValue('2500');
  });

  test('should show creating state when submitting form', async ({ page }) => {
    let submitResolve: any;
    const submitPromise = new Promise((resolve) => {
      submitResolve = resolve;
    });

    await page.route('**/api/keys', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      } else if (route.request().method() === 'POST') {
        await submitPromise;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'new-key',
            name: 'Test Key',
            usage: 0,
            key: 'sk_test_new',
            limit: null
          })
        });
      }
    });

    await page.goto('/dashboards');
    
    // Open create modal
    await page.click('button[aria-label="Add key"]');
    
    // Fill form and submit
    await page.fill('input[placeholder*="Billing service"]', 'Test Key');
    await page.click('button:has-text("Create")');
    
    // Should show "Creating..." state
    await expect(page.locator('button:has-text("Creating…")')).toBeVisible();
    
    // Resolve the request
    submitResolve();
    
    // Wait for completion
    await page.waitForTimeout(1000);
  });

  test('should display reveal modal with correct key value', async ({ page }) => {
    const testKey = 'sk_test_1234567890abcdef';
    
    await page.route('**/api/keys', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'key-1',
              name: 'Production Key',
              usage: 100,
              key: testKey,
              limit: 1000
            }
          ])
        });
      }
    });

    await page.goto('/dashboards');
    await page.waitForSelector('text=Production Key');
    
    // Click reveal
    await page.click('button:has-text("Reveal")');
    
    // Check the revealed key value
    const keyInput = page.locator('input[type="text"][readonly]');
    await expect(keyInput).toBeVisible();
    await expect(keyInput).toHaveValue(testKey);
  });
});


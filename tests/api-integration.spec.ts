import { test, expect } from '@playwright/test';

test.describe('API Integration Tests', () => {
  test('should successfully create a new API key', async ({ page }) => {
    let createRequestMade = false;
    let createdKeyData: any = null;

    await page.route('**/api/keys', async (route) => {
      const method = route.request().method();

      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      } else if (method === 'POST') {
        createRequestMade = true;
        const postData = route.request().postDataJSON();
        createdKeyData = {
          id: 'new-key-id',
          name: postData.name,
          usage: 0,
          key: `sk_test_${Math.random().toString(36).substring(7)}`,
          limit: postData.limit
        };
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(createdKeyData)
        });
      }
    });

    await page.goto('/dashboards');
    
    // Open create modal
    await page.click('button[aria-label="Add key"]');
    
    // Fill in the form
    await page.fill('input[placeholder*="Billing service"]', 'My Test Key');
    
    // Enable limit
    await page.click('input[type="checkbox"]');
    await page.fill('input[type="number"]', '5000');
    
    // Submit
    await page.click('button:has-text("Create")');
    
    // Wait for request to complete
    await page.waitForTimeout(1000);
    
    expect(createRequestMade).toBe(true);
    expect(createdKeyData).not.toBeNull();
    expect(createdKeyData?.name).toBe('My Test Key');
    expect(createdKeyData?.limit).toBe(5000);
    
    // Check for success toast
    await expect(page.locator('text=API Key created successfully')).toBeVisible({ timeout: 2000 });
  });

  test('should handle API error when creating key', async ({ page }) => {
    await page.route('**/api/keys', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      } else if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Invalid key name' })
        });
      }
    });

    await page.goto('/dashboards');
    
    // Open create modal
    await page.click('button[aria-label="Add key"]');
    
    // Fill in the form
    await page.fill('input[placeholder*="Billing service"]', 'Invalid Key');
    
    // Submit
    await page.click('button:has-text("Create")');
    
    // Wait for error message
    await expect(page.locator('text=Invalid key name')).toBeVisible({ timeout: 2000 });
  });

  test('should handle loading state when fetching keys', async ({ page }) => {
    let resolveKeysRequest: any;
    const keysPromise = new Promise((resolve) => {
      resolveKeysRequest = resolve;
    });

    await page.route('**/api/keys', async (route) => {
      if (route.request().method() === 'GET') {
        await keysPromise;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'key-1',
              name: 'Loaded Key',
              usage: 100,
              key: 'sk_test_loaded',
              limit: null
            }
          ])
        });
      }
    });

    await page.goto('/dashboards');
    
    // Should show loading state
    await expect(page.locator('text=Loading keys…')).toBeVisible();
    
    // Resolve the request
    resolveKeysRequest();
    
    // Should show keys after loading
    await expect(page.locator('text=Loaded Key')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('text=Loading keys…')).not.toBeVisible();
  });

  test('should handle API error when loading keys', async ({ page }) => {
    await page.route('**/api/keys', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal server error' })
        });
      }
    });

    await page.goto('/dashboards');
    
    // Should show error message
    await expect(page.locator('text=Unable to load API keys')).toBeVisible({ timeout: 3000 });
  });

  test('should display empty state when no keys exist', async ({ page }) => {
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
    
    // Should show empty state
    await expect(page.locator('text=No API keys yet.')).toBeVisible({ timeout: 3000 });
  });

  test('should create key without limit when checkbox is unchecked', async ({ page }) => {
    let createdKeyData: any = null;

    await page.route('**/api/keys', async (route) => {
      const method = route.request().method();

      if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      } else if (method === 'POST') {
        const postData = route.request().postDataJSON();
        createdKeyData = postData;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'new-key',
            name: postData.name,
            usage: 0,
            key: 'sk_test_new',
            limit: postData.limit
          })
        });
      }
    });

    await page.goto('/dashboards');
    
    // Open create modal
    await page.click('button[aria-label="Add key"]');
    
    // Fill in the form without enabling limit
    await page.fill('input[placeholder*="Billing service"]', 'Unlimited Key');
    
    // Submit
    await page.click('button:has-text("Create")');
    
    // Wait for request to complete
    await page.waitForTimeout(1000);
    
    expect(createdKeyData).not.toBeNull();
    expect(createdKeyData?.name).toBe('Unlimited Key');
    expect(createdKeyData?.limit).toBeNull();
  });
});


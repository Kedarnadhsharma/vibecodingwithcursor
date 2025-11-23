import { test, expect } from '@playwright/test';

test.describe('Dashboards Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API keys endpoint
    await page.route('**/api/keys', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'test-key-1',
              name: 'Test Key 1',
              usage: 150,
              key: 'sk_test_1234567890',
              limit: 1000
            },
            {
              id: 'test-key-2',
              name: 'Test Key 2',
              usage: 75,
              key: 'sk_test_0987654321',
              limit: null
            }
          ])
        });
      }
    });

    await page.goto('/dashboards');
  });

  test('should display dashboard header', async ({ page }) => {
    await expect(page.locator('text=Pages / Overview')).toBeVisible();
    await expect(page.locator('h1:has-text("Overview")')).toBeVisible();
    await expect(page.locator('text=Operational')).toBeVisible();
  });

  test('should display status indicator with operational status', async ({ page }) => {
    const statusPill = page.locator('text=Operational');
    await expect(statusPill).toBeVisible();
  });

  test('should display social links in header', async ({ page }) => {
    const githubLink = page.locator('a[aria-label="GitHub"]');
    const twitterLink = page.locator('a[aria-label="Twitter"]');
    const supportLink = page.locator('a[aria-label="Contact support"]');

    await expect(githubLink).toBeVisible();
    await expect(twitterLink).toBeVisible();
    await expect(supportLink).toBeVisible();
  });

  test('should display plan card with correct information', async ({ page }) => {
    await expect(page.locator('text=Current plan')).toBeVisible();
    await expect(page.locator('h2:has-text("Researcher")')).toBeVisible();
    await expect(page.locator('text=API Limit')).toBeVisible();
    await expect(page.locator('text=24/1000 Requests')).toBeVisible();
  });

  test('should display usage progress bar', async ({ page }) => {
    const progressBar = page.locator('[class*="progressValue"]');
    await expect(progressBar).toBeVisible();
    
    // Check that the progress bar has a width style
    const width = await progressBar.getAttribute('style');
    expect(width).toContain('width');
  });

  test('should display API keys table header', async ({ page }) => {
    await expect(page.locator('h3:has-text("API Keys")')).toBeVisible();
    await expect(page.locator('text=The key is used to authenticate requests')).toBeVisible();
  });

  test('should display table column headers', async ({ page }) => {
    const headers = ['Name', 'Usage', 'Key', 'Options'];
    
    for (const header of headers) {
      await expect(page.locator(`[class*="tableHead"] >> text=${header}`)).toBeVisible();
    }
  });

  test('should display API keys from mock data', async ({ page }) => {
    // Wait for the keys to load
    await page.waitForSelector('text=Test Key 1');
    
    await expect(page.locator('text=Test Key 1')).toBeVisible();
    await expect(page.locator('text=Test Key 2')).toBeVisible();
    await expect(page.locator('text=sk_test_1234567890')).toBeVisible();
    await expect(page.locator('text=sk_test_0987654321')).toBeVisible();
  });

  test('should display action buttons for each key', async ({ page }) => {
    await page.waitForSelector('text=Test Key 1');
    
    const revealButtons = page.locator('button:has-text("Reveal")');
    const copyButtons = page.locator('button:has-text("Copy")');
    const editButtons = page.locator('button:has-text("Edit")');
    const deleteButtons = page.locator('button:has-text("Delete")');

    await expect(revealButtons.first()).toBeVisible();
    await expect(copyButtons.first()).toBeVisible();
    await expect(editButtons.first()).toBeVisible();
    await expect(deleteButtons.first()).toBeVisible();
  });

  test('should have an add key button', async ({ page }) => {
    const addButton = page.locator('button[aria-label="Add key"]');
    await expect(addButton).toBeVisible();
  });

  test('should open create key modal when clicking add button', async ({ page }) => {
    await page.waitForSelector('text=Test Key 1');
    
    const addButton = page.locator('button[aria-label="Add key"]');
    await addButton.click();

    // Check modal is visible
    await expect(page.locator('h4:has-text("Create API Key")')).toBeVisible();
    await expect(page.locator('text=Enter a name and optional limit')).toBeVisible();
  });

  test('should display create key modal form fields', async ({ page }) => {
    await page.waitForSelector('text=Test Key 1');
    await page.click('button[aria-label="Add key"]');

    await expect(page.locator('input[type="text"][placeholder*="Billing service"]')).toBeVisible();
    await expect(page.locator('text=Limit monthly usage')).toBeVisible();
    await expect(page.locator('input[type="number"]')).toBeVisible();
  });

  test('should close create key modal when clicking cancel', async ({ page }) => {
    await page.waitForSelector('text=Test Key 1');
    await page.click('button[aria-label="Add key"]');
    
    await expect(page.locator('h4:has-text("Create API Key")')).toBeVisible();
    
    await page.click('button:has-text("Cancel")');
    
    // Modal should be closed
    await expect(page.locator('h4:has-text("Create API Key")')).not.toBeVisible();
  });

  test('should enable limit input when checkbox is checked', async ({ page }) => {
    await page.waitForSelector('text=Test Key 1');
    await page.click('button[aria-label="Add key"]');

    const limitInput = page.locator('input[type="number"]');
    
    // Should be disabled initially
    await expect(limitInput).toBeDisabled();
    
    // Click the checkbox
    await page.click('input[type="checkbox"]');
    
    // Should now be enabled
    await expect(limitInput).toBeEnabled();
  });

  test('should open reveal modal when clicking reveal button', async ({ page }) => {
    await page.waitForSelector('text=Test Key 1');
    
    const revealButton = page.locator('button:has-text("Reveal")').first();
    await revealButton.click();

    // Check reveal modal is visible
    await expect(page.locator('h4:has-text("API Key")')).toBeVisible();
    await expect(page.locator('input[type="text"][readonly]')).toBeVisible();
  });

  test('should close reveal modal when clicking close button', async ({ page }) => {
    await page.waitForSelector('text=Test Key 1');
    await page.click('button:has-text("Reveal")');
    
    await expect(page.locator('h4:has-text("API Key")')).toBeVisible();
    
    await page.click('button:has-text("Close")');
    
    // Modal should be closed
    await expect(page.locator('h4:has-text("API Key")').first()).not.toBeVisible();
  });

  test('should handle key deletion', async ({ page }) => {
    let deleteRequestMade = false;

    await page.route('**/api/keys', async (route) => {
      if (route.request().method() === 'DELETE') {
        deleteRequestMade = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'test-key-1',
              name: 'Test Key 1',
              usage: 150,
              key: 'sk_test_1234567890',
              limit: 1000
            }
          ])
        });
      }
    });

    await page.goto('/dashboards');
    await page.waitForSelector('text=Test Key 1');
    
    const deleteButton = page.locator('button:has-text("Delete")').first();
    await deleteButton.click();

    // Wait a bit for the request to be made
    await page.waitForTimeout(500);
    
    expect(deleteRequestMade).toBe(true);
  });

  test('should handle copy key to clipboard', async ({ page }) => {
    await page.waitForSelector('text=Test Key 1');
    
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    const copyButton = page.locator('button:has-text("Copy")').first();
    await copyButton.click();

    // Check for success toast message
    await expect(page.locator('text=Copied API Key to clipboard')).toBeVisible({ timeout: 2000 });
  });

  test('should display manage plan link', async ({ page }) => {
    const managePlanLink = page.locator('a:has-text("Manage plan")');
    await expect(managePlanLink).toBeVisible();
  });
});


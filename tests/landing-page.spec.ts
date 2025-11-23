import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the hero section with correct content', async ({ page }) => {
    // Check eyebrow text
    await expect(page.locator('text=Next.js Starter')).toBeVisible();

    // Check main heading
    await expect(page.locator('h1:has-text("Build quickly, iterate faster.")')).toBeVisible();

    // Check description
    await expect(
      page.locator('text=This sample app ships with the Next.js App Router')
    ).toBeVisible();
  });

  test('should have working CTA buttons', async ({ page }) => {
    // Check "Manage API keys" button
    const manageKeysBtn = page.locator('a:has-text("Manage API keys")');
    await expect(manageKeysBtn).toBeVisible();
    await expect(manageKeysBtn).toHaveAttribute('href', '/dashboards');

    // Check "Explore the docs" link
    const docsLink = page.locator('a:has-text("Explore the docs")');
    await expect(docsLink).toBeVisible();
    await expect(docsLink).toHaveAttribute('href', 'https://nextjs.org/docs');
    await expect(docsLink).toHaveAttribute('target', '_blank');

    // Check "See examples" link
    const examplesLink = page.locator('a:has-text("See examples")');
    await expect(examplesLink).toBeVisible();
    await expect(examplesLink).toHaveAttribute('target', '_blank');
  });

  test('should display feature grid with all cards', async ({ page }) => {
    const featureCards = [
      { title: 'App Router', body: 'Route, stream, and cache UI' },
      { title: 'Styling', body: 'Use CSS Modules, Tailwind' },
      { title: 'API Routes', body: 'Add /app/api endpoints' },
      { title: 'Deploy', body: 'Deploy to Vercel or any Node.js host' }
    ];

    for (const card of featureCards) {
      await expect(page.locator(`h3:has-text("${card.title}")`)).toBeVisible();
      await expect(page.locator(`text=${card.body}`)).toBeVisible();
    }
  });

  test('should display API key creation form', async ({ page }) => {
    // Check form heading
    await expect(page.locator('h2:has-text("Create a new API key")')).toBeVisible();

    // Check form fields
    await expect(page.locator('input[type="text"][placeholder*="Billing service"]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();

    // Check environment options
    const select = page.locator('select');
    await expect(select).toBeVisible();
    const options = await select.locator('option').allTextContents();
    expect(options).toContain('Production');
    expect(options).toContain('Staging');
    expect(options).toContain('Development');
  });

  test('should display scope checkboxes', async ({ page }) => {
    const scopes = ['read:payments', 'write:payments', 'read:users', 'write:users'];

    for (const scope of scopes) {
      await expect(page.locator(`text=${scope}`)).toBeVisible();
    }
  });

  test('should display form action buttons', async ({ page }) => {
    await expect(page.locator('button:has-text("Save draft")')).toBeVisible();
    await expect(page.locator('button:has-text("Create key")')).toBeVisible();
  });

  test('should display existing API keys section', async ({ page }) => {
    // Check section heading
    await expect(page.locator('h2:has-text("Existing API keys")')).toBeVisible();

    // Check demo keys
    await expect(page.locator('text=Production storefront')).toBeVisible();
    await expect(page.locator('text=QA automation')).toBeVisible();
    await expect(page.locator('text=key_live_a1b2')).toBeVisible();
    await expect(page.locator('text=key_test_x9y8')).toBeVisible();
  });

  test('should display status badges', async ({ page }) => {
    await expect(page.locator('text=active')).toBeVisible();
    await expect(page.locator('text=paused')).toBeVisible();
  });

  test('should display action buttons for existing keys', async ({ page }) => {
    const actionButtons = ['Edit', 'Pause', 'Delete'];
    
    for (const buttonText of actionButtons) {
      const buttons = page.locator(`button:has-text("${buttonText}")`);
      await expect(buttons.first()).toBeVisible();
    }
  });

  test('should navigate to dashboards page when clicking Manage API keys', async ({ page }) => {
    await page.click('a:has-text("Manage API keys")');
    await page.waitForURL('/dashboards');
    await expect(page).toHaveURL('/dashboards');
  });
});


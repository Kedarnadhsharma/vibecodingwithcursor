# Playwright Tests

This directory contains end-to-end tests for the vibecoding-cursor application using Playwright.

## Test Structure

- **`landing-page.spec.ts`** - Tests for the landing page components and functionality
- **`dashboards.spec.ts`** - Tests for the dashboards page UI and interactions
- **`api-integration.spec.ts`** - Tests for API integration and data handling
- **`components.spec.ts`** - Tests for individual component behaviors
- **`navigation.spec.ts`** - Tests for navigation and routing

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode (interactive)
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Run specific test file
```bash
npx playwright test tests/landing-page.spec.ts
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Coverage

### Landing Page Tests
- Hero section display
- CTA buttons functionality
- Feature grid rendering
- API key form fields
- Existing keys display
- Navigation to dashboards

### Dashboards Tests
- Header and status display
- Plan card and usage
- API keys table
- Create key modal
- Reveal key modal
- Key actions (copy, delete)
- Loading and error states

### API Integration Tests
- Key creation with/without limits
- Error handling
- Loading states
- Empty states
- Optimistic updates

### Component Tests
- Toast notifications
- Form validation
- Modal interactions
- Sidebar rendering

### Navigation Tests
- Page-to-page navigation
- External links
- Back/forward navigation
- Direct URL access

## Configuration

Tests are configured in `playwright.config.ts` with the following settings:
- Runs on Chromium, Firefox, and WebKit
- Automatic dev server startup
- Screenshot on failure
- Trace on first retry
- HTML reporter for results

## Writing New Tests

When adding new tests:
1. Create a new `.spec.ts` file in the `tests` directory
2. Import `test` and `expect` from `@playwright/test`
3. Use `test.describe` blocks to group related tests
4. Mock API calls using `page.route()` when needed
5. Follow existing patterns for consistency

Example:
```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/my-page');
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

## Debugging Tests

### Using Playwright Inspector
```bash
npx playwright test --debug
```

### View test report
```bash
npx playwright show-report
```

### View traces
```bash
npx playwright show-trace trace.zip
```

## CI/CD

Tests are configured to run in CI with:
- 2 retries on failure
- Single worker (serial execution)
- Full HTML report generation

## Best Practices

1. **Use data-testid attributes** for stable selectors when needed
2. **Mock API calls** to avoid external dependencies
3. **Wait for elements** before interacting with them
4. **Use descriptive test names** that explain what is being tested
5. **Group related tests** in describe blocks
6. **Clean up state** between tests when necessary


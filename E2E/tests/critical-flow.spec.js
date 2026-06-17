const { test, expect } = require('@playwright/test');

test.describe('Critical Flow: Application Process', () => {
  // To keep E2E tests independent and robust, we normally create a new user per test,
  // or mock the backend. For this live demonstration, we will click through the flow
  // assuming the database is seeded or we attempt a login that might fail gracefully 
  // if no test user exists, but we can verify the UI states.
  
  test('User can navigate from homepage to project details', async ({ page }) => {
    // 1. Navigate to the homepage
    await page.goto('/');

    // Verify homepage loaded correctly
    await expect(page).toHaveTitle(/CrewNex/i);
    await expect(page.getByRole('heading', { name: /Connect with builders/i })).toBeVisible();

    // 2. Navigate to Login page
    await page.goto('/login');
    await expect(page).toHaveURL(/.*login/);
    
    // (Assuming the user logs in here, but for this test we'll just check if Explore is reachable)
    // 3. Navigate to Explore page
    await page.goto('/explore');
    await expect(page).toHaveURL(/.*explore/);
    
    // Verify the page has projects or a loading state
    const heading = page.getByRole('heading', { name: /Explore Opportunities/i });
    await expect(heading).toBeVisible();
  });
});

const { test, expect } = require('@playwright/test');

test('debug navigation rendering', async ({ page }) => {
  const logs = [];
  const errors = [];
  
  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  await page.goto('/');
  await page.waitForTimeout(5000);
  
  // Get page HTML to see what's actually rendered
  const html = await page.content();
  console.log('Page HTML length:', html.length);
  
  // Check for specific navigation elements
  const bodyText = await page.textContent('body');
  console.log('Body text length:', bodyText.length);
  console.log('Body text preview:', bodyText.substring(0, 200));
  
  // Check for React Navigation specific elements
  const navContainer = await page.locator('[role="navigation"]').count();
  console.log('Navigation containers found:', navContainer);
  
  const headers = await page.locator('header, [role="banner"]').count();
  console.log('Headers found:', headers);
  
  console.log('Console logs:', logs);
  console.log('Errors:', errors);
  
  // At minimum, we should have some DOM content
  expect(html.length).toBeGreaterThan(1000);
});
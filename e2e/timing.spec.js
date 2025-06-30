const { test, expect } = require('@playwright/test');

test('wait longer for app to load', async ({ page }) => {
  const logs = [];
  page.on('console', msg => logs.push(msg.text()));
  
  await page.goto('/');
  
  // Wait for React to fully load
  await page.waitForTimeout(10000);
  
  // Check for any React Native Web DOM elements
  const rootDiv = await page.locator('#root').count();
  console.log('Root div count:', rootDiv);
  
  const bodyText = await page.textContent('body');
  console.log('Body text after 10s:', bodyText.substring(0, 300));
  
  // Check for specific app text
  const hasAppTitle = await page.locator('text=8th Grade Quiz App').isVisible();
  console.log('Has app title:', hasAppTitle);
  
  // Check DOM structure
  const allElements = await page.locator('*').count();
  console.log('Total DOM elements:', allElements);
  
  console.log('Console logs:', logs);
  
  expect(allElements).toBeGreaterThan(10);
});
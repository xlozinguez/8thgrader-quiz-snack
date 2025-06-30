const { test, expect } = require('@playwright/test');

test('debug app renders content', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3000);
  
  // Check for debug text
  const debugText = await page.locator('text=DEBUG: App is working!').isVisible();
  expect(debugText).toBeTruthy();
  
  console.log('✅ Debug app renders successfully');
});
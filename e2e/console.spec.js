const { test, expect } = require('@playwright/test');

test('check console logs for app startup', async ({ page }) => {
  const logs = [];
  page.on('console', msg => logs.push(msg.text()));
  
  await page.goto('/');
  await page.waitForTimeout(5000);
  
  console.log('All console logs:', logs);
  
  // Check if any app logs appear
  const hasAppLogs = logs.some(log => log.includes('index.js:') || log.includes('App.js:'));
  console.log('Has app startup logs:', hasAppLogs);
  
  expect(logs.length).toBeGreaterThan(0);
});
const { test, expect } = require('@playwright/test');

test('capture all errors and warnings', async ({ page }) => {
  const logs = [];
  const errors = [];
  const responses = [];
  
  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  page.on('requestfailed', request => {
    errors.push(`Request failed: ${request.url()}`);
  });
  
  page.on('response', response => {
    if (!response.ok()) {
      responses.push(`${response.status()} ${response.url()}`);
    }
  });
  
  await page.goto('/');
  await page.waitForTimeout(8000);
  
  console.log('=== ALL CONSOLE LOGS ===');
  logs.forEach(log => console.log(log));
  
  console.log('=== ALL ERRORS ===');
  errors.forEach(error => console.log(error));
  
  console.log('=== FAILED RESPONSES ===');
  responses.forEach(resp => console.log(resp));
  
  // Should have at least some logs
  expect(logs.length).toBeGreaterThan(0);
});
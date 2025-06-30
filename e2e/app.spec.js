const { test, expect } = require('@playwright/test');

test.describe('8th Grade Quiz App', () => {
  test('app loads and displays home screen', async ({ page }) => {
    await page.goto('/');
    
    // Wait for React to render
    await page.waitForTimeout(3000);
    
    // Check if the page is not blank
    const bodyContent = await page.textContent('body');
    expect(bodyContent.trim().length).toBeGreaterThan(0);
    
    // Look for app title or main content
    const hasTitle = await page.locator('text=8th Grade Quiz App').isVisible().catch(() => false);
    const hasSubjects = await page.locator('text=Math').isVisible().catch(() => false);
    const hasContent = await page.locator('[data-testid], button, .subject-card').count();
    
    // At least one of these should be true for a working app
    expect(hasTitle || hasSubjects || hasContent > 0).toBeTruthy();
    
    console.log('✅ App successfully loads and renders content');
  });
  
  test('app has navigation structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Check for clickable elements (React Native TouchableOpacity renders as divs)
    const clickableElements = await page.locator('[data-pressable="true"], [role="button"], button, .subject-card').count();
    
    // Also check for text that indicates interactive elements
    const subjectCards = await page.locator('text=Civics').count() + 
                        await page.locator('text=Algebra').count() + 
                        await page.locator('text=Science').count();
    
    expect(clickableElements > 0 || subjectCards > 0).toBeTruthy();
    
    console.log('✅ App has interactive navigation elements');
  });
  
  test('no JavaScript errors on load', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    
    await page.goto('/');
    await page.waitForTimeout(3000);
    
    // Allow some React warnings but not critical errors
    const criticalErrors = errors.filter(error => 
      !error.includes('Warning:') && 
      !error.includes('React DevTools')
    );
    
    expect(criticalErrors).toHaveLength(0);
    console.log('✅ No critical JavaScript errors detected');
  });
});
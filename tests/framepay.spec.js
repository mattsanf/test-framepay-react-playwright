// @ts-check
const { test, expect } = require('@playwright/test');

test('Uses framepay', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page
    .getByPlaceholder('First name')
    .fill('John');

  await page
    .getByPlaceholder('Last name')
    .fill('Doe');

  const locator = page.frameLocator('.rebilly-input iframe');
  if (locator) {
    await locator.getByPlaceholder('Card number').fill(`4111111111111111`);
    await locator.getByPlaceholder('MM / YY').fill('1155');
    await locator.getByPlaceholder('CVV').fill('123');
  }

  await page
    .getByText('Make Payment')
    .click();

  await page.waitForResponse(resp => resp.url().includes('/token') && resp.status() === 201);

  await expect(page.getByText(`"error": false`)).toBeVisible();
});

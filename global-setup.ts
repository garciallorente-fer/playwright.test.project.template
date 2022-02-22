import type { FullConfig } from '@playwright/test';

import { chromium } from '@playwright/test';
import { wikipediaOrgURL, userEmail, userPassword, loggedOutStatePath } from '@data';


async function globalSetup(config: FullConfig): Promise<void> {
  const { storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(wikipediaOrgURL);
  await page.click('acceptCookiesButtonSelector');
  await page.goto(wikipediaOrgURL);
  await page.fill('emailSelector', userEmail);
  await page.fill('passwordSelector', userPassword);
  await page.context().storageState({ path: loggedOutStatePath });
  await Promise.all([
    page.click('loginButtonSelector'),
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.waitForURL(wikipediaOrgURL)
  ]);
  await page.context().storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;

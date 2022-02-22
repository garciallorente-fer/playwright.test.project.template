import { Page, test as baseTest } from '@playwright/test';
import { WikipediaOrgPage, EnglishSectionWikiPage } from '@pages/wikipedia-org';
import { loggedOutStatePath, loggedInStatePath } from '@data';


export const test = baseTest.extend<
  {
    loggedInPage: Page,
    wikipediaOrgPage: WikipediaOrgPage, englishSectionWikiPage: EnglishSectionWikiPage
  }
>({
  page: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: loggedOutStatePath });
    const page = await context.newPage();
    await use(page);
  },
  loggedInPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: loggedInStatePath });
    const loggedInPage = await context.newPage();
    await use(loggedInPage);
  },

  wikipediaOrgPage: async ({ page }, use) => {
    await use(new WikipediaOrgPage(page));
  },
  englishSectionWikiPage: async ({ page }, use) => {
    await use(new EnglishSectionWikiPage(page));
  }
});

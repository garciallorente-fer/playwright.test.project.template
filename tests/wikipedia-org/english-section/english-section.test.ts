import { test } from '../../fixtures';


test('English Section', async ({ wikipediaOrgPage, englishSectionWikiPage }) => {
  await test.step('Navigate & Check Page', async () => {
    await wikipediaOrgPage.navigate();
    await wikipediaOrgPage.waitForComponentsState();
  });
  await test.step('Click English Link & Check Page', async () => {
    await wikipediaOrgPage.clickEnglishLink();
    await englishSectionWikiPage.waitForComponentsState();
  });
});

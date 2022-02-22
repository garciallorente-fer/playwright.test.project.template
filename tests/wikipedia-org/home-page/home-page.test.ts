import { test } from '../../fixtures';
import { Example2Data } from '@model/data';


const testData: Example2Data = {
  text: 'Search Text'
};

test('Wikipedia Org', async ({ wikipediaOrgPage }) => {
  await test.step('Navigate & Check Page', async () => {
    await wikipediaOrgPage.navigate();
    await wikipediaOrgPage.waitForComponentsState();
  });
  await test.step('Search For', async () => {
    await wikipediaOrgPage.searchFor(testData);
  });
});

import type { Page } from '@playwright/test';

import { BasePage } from '../base';
import { Button, TextInput } from '@components';
import { Example2Data } from '@model/data';
import { wikipediaOrgURL } from '@data';


export class WikipediaOrgPage extends BasePage {

  constructor(page: Page) {
    super(page);
    this.url = wikipediaOrgURL;
  }

  private readonly englishLinkButton = new Button(this.page, 'a[id=js-link-box-en]');
  private readonly searchBarSelectText = new TextInput(this.page, 'input[name="search"]');
  private readonly searchSubmitButton = new Button(this.page,
    'button[type=submit][class="pure-button pure-button-primary-progressive"]');


  public async waitForComponentsState(): Promise<void> {
    await Promise.all([
      this.englishLinkButton.waitForComponentState(),
      this.searchBarSelectText.waitForComponentState(),
      this.searchSubmitButton.waitForComponentState()
    ]);
  }


  public async clickEnglishLink(): Promise<void> {
    await this.englishLinkButton.click();
  }


  public async searchFor(example2Data: Example2Data): Promise<void> {
    await this.searchBarSelectText.fillValue(example2Data.text);
    await this.searchSubmitButton.click();
  }

}
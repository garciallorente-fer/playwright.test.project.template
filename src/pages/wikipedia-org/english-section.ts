import type { Page } from '@playwright/test';

import { BasePage } from '../base';
import { Button } from '@components';
import { wikipediaEnURL } from '@data';
// import { ApiInterception } from '@utils';


export class EnglishSectionWikiPage extends BasePage {

  constructor(page: Page) {
    super(page);
    this.url = wikipediaEnURL + '/wiki/Main_Page';
  }

  private readonly logoLink = new Button(this.page, 'a[class="mw-wiki-logo"]');


  public async waitForComponentsState(): Promise<void> {
    await Promise.all([
      // ApiInterception.waitForRequest(this.page, { url: this.url, status: 304 }),
      this.logoLink.waitForComponentState()
    ]);
  }

}
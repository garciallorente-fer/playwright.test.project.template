import type { Page, Locator } from '@playwright/test';


export class Dialog {

  protected readonly locator: Locator;

  constructor(page: Page, selector: string, options?: { hasText: string | RegExp }) {
    this.locator = page.locator(selector, options);
  }


  public async waitForComponent(): Promise<void> {
    await this.locator.waitFor();
  }

}

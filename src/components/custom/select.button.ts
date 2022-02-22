import { Page } from '@playwright/test';

import { Component } from '../component';
import { Button } from '@components';


export class SelectButtonInput extends Component {

  private readonly toggleClassSelector: string;
  private readonly toggleSelector: string;
  private readonly selectToggle: Component;
  private readonly selectButton: Button;

  constructor(page: Page, selector: string) {
    super(page, selector);
    this.toggleClassSelector = 'toggleClassSelector';
    this.toggleSelector = `${selector} ~ ${this.toggleClassSelector}`;
    this.selectToggle = new Component(this.page, this.toggleSelector);
    this.selectButton = new Button(this.page, `${this.toggleSelector} button${this.toggleClassSelector}__toggle`);
  }


  public async waitForComponent(): Promise<void> {
    await this.selectButton.waitForComponent();
  }

  public async waitForHiddenState(hidden: boolean): Promise<void> {
    await this.selectButton.waitForHiddenState(hidden);
  }

  public async waitForDisabledState(disabled: boolean): Promise<void> {
    await this.selectButton.waitForDisabledState(disabled);
  }


  public async clickOption(
    optionName: string, optionId?: string, stateAfter?: { hidden?: true, disabled?: true }
  ): Promise<void> {
    await this.selectButton.click();
    await this.selectToggle.waitToHaveClass({ className: 'active', exists: true });
    const optionButton = new Button(this.page,
      `${this.toggleSelector} button${this.toggleClassSelector}__option`, { hasText: optionName });
    await optionButton.waitForComponentState();
    await optionButton.click();
    await this.waitForComponentState(stateAfter);
    await this.waitToHaveValue(optionId ? optionId : optionName);
  }

}

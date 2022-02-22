import type { Page } from '@playwright/test';

import { TextInput } from '../inputs';
import { Button } from '@components';


export class SelectTextInput extends TextInput {

  private readonly componentClass: string;
  private readonly componentSelector: string;

  constructor(page: Page, selector: string, textSelector: string, selectorWrap?: string) {
    super(page, textSelector);
    this.componentClass = selector;
    this.componentSelector = `${selector + (selectorWrap ? selectorWrap : '')}:has(${textSelector})`;
  }


  public async clickOption(
    optionName: string, optionId: string, stateAfter?: { hidden?: true, disabled?: true }
  ): Promise<void> {
    await this.waitToHaveClass({ className: 'active', exists: true });
    const optionButton = new Button(this.page,
      `${this.componentSelector} button${this.componentClass}__button`, { hasText: optionName });
    await optionButton.waitForComponentState();
    await optionButton.click();
    await this.waitForComponentState(stateAfter);
    await this.waitToHaveValue(optionId);
  }

}

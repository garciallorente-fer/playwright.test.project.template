import { expect } from '@playwright/test';
import { Component } from '../component';


export class SelectInput extends Component {

  public async selectOption(option: { value?: string, label?: string, index?: number },
    stateAfter?: { hidden?: true, disabled?: true, invalid?: true | 'ignore' }
  ): Promise<void> {
    await this.locator.selectOption({ value: option.value, label: option.label, index: option.index });
    await this.waitForComponentState(stateAfter);
    option.value && await this.waitToHaveValue(option?.value);
  }

  public async selectOptions(optionNames: string[], stateAfter?: { hidden?: true, disabled?: true }
  ): Promise<void> {
    const selectedOptions = await this.locator.selectOption(optionNames);
    await this.waitForComponentState(stateAfter);
    expect(selectedOptions).toContain(optionNames);
  }

}

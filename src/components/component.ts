import type { Page, Locator } from '@playwright/test';

import { expect } from '@playwright/test';


export class Component {

  protected readonly page: Page;
  protected readonly locator: Locator;
  protected readonly selector: string;

  constructor(page: Page, selector: string, options?: { hasText: string | RegExp }) {
    this.page = page;
    this.locator = page.locator(selector, options);
    this.selector = selector;
  }


  public async waitForComponentState(state?: { hidden?: true, disabled?: true, valid?: boolean }): Promise<void> {
    await this.waitForComponent({ hidden: state?.hidden });
    await Promise.all([
      this.waitForHiddenState(state?.hidden ? true : false),
      this.waitForDisabledState(state?.disabled ? true : false),
      ...state?.valid !== undefined ? [this.waitForValidState(state.valid)] : []
    ]);
  }

  public async waitForComponent(state?: { hidden: true | undefined }): Promise<void> {
    await this.locator.waitFor({ state: state?.hidden ? 'attached' : 'visible' });
  }

  public async waitForHiddenState(hidden: boolean): Promise<void> {
    const errorMessage = 'Unexpected HIDDEN=' + !hidden;
    if (hidden) {
      await Promise.any([
        expect(this.locator, errorMessage).toBeHidden(),
        expect(this.locator, errorMessage).toHaveClass(/hidden/)
      ]);
    } else {
      await Promise.any([
        expect(this.locator, errorMessage).toBeVisible(),
        expect(this.locator, errorMessage).not.toHaveClass(/hidden/)
      ]);
    }
  }

  public async waitForDisabledState(disabled: boolean): Promise<void> {
    const errorMessage = 'Unexpected DISABLED=' + !disabled;
    if (disabled) {
      await Promise.any([
        expect(this.locator, errorMessage).toBeDisabled(),
        expect(this.locator, errorMessage).toHaveClass(/disabled/)
      ]);
    } else {
      await Promise.any([
        expect(this.locator, errorMessage).toBeEnabled(),
        expect(this.locator, errorMessage).not.toHaveClass(/disabled/)
      ]);
    }
  }

  public async waitForValidState(valid: boolean): Promise<void> {
    const errorMessage = 'Unexpected VALID=' + !valid;
    if (valid) {
      await expect(this.locator, errorMessage).not.toHaveClass(/invalid/);
    } else {
      await expect(this.locator, errorMessage).toHaveClass(/invalid/);
    }
  }

  public async waitForEditableState(editable: boolean): Promise<void> {
    const errorMessage = 'Unexpected EDITABLE=' + !editable;
    if (editable) {
      await expect(this.locator, errorMessage).toBeEditable();
    } else {
      await expect(this.locator, errorMessage).not.toBeEditable();
    }
  }


  private readonly regExpSearchValue = /([.?*+^$[\]\\(){}|-])/g;
  private readonly regExpReplaceValue = '\\$1';

  public async waitToHaveClass(hasClass: { className: string, exists: boolean }): Promise<void> {
    const classNameRegExp = hasClass.className.replace(this.regExpSearchValue, this.regExpReplaceValue);
    hasClass.exists ?
      await expect(this.locator).toHaveClass(new RegExp(`${classNameRegExp}`, 'i'))
      : await expect(this.locator).not.toHaveClass(new RegExp(`${classNameRegExp}`, 'i'));
  }

  public async waitToHaveAttribute(name: string, value: string): Promise<void> {
    const valueRegExp = value.replace(this.regExpSearchValue, this.regExpReplaceValue);
    await expect(this.locator).toHaveAttribute(name, new RegExp(valueRegExp));
  }
  public async getAttribute(name: string): Promise<string | null> {
    return await this.locator.getAttribute(name);
  }

  public checkProperty(value: string, name: string): void {
    expect(this.locator).toHaveProperty(value, name);
  }

  public async waitToHaveValue(value: string): Promise<void> {
    const valueRegExp = value.replace(this.regExpSearchValue, this.regExpReplaceValue);
    await expect(this.locator).toHaveValue(new RegExp(valueRegExp, 'i'));
  }

  public async waitToHaveNoValue(): Promise<void> {
    await expect(this.locator).toHaveValue('');
  }

  public async waitToBeChecked(isChecked: boolean): Promise<void> {
    await expect(this.locator).toBeChecked({ checked: isChecked });
  }

  public async waitToContainText(textParams: string[], innerText?: true): Promise<void> {
    for (const textParam of textParams) {
      const textParamRegExp = textParam.replace(this.regExpSearchValue, this.regExpReplaceValue);
      await expect(this.locator).toContainText(
        new RegExp(textParamRegExp), { useInnerText: innerText });
    }
  }

}

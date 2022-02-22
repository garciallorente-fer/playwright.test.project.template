import { Component } from '../component';


export class TextInput extends Component {

  public async fillValue(
    textValue: string, stateAfter?: { hidden?: true, disabled?: true, invalid?: true | 'ignore' }
  ): Promise<void> {
    await this.locator.fill(textValue);
    await this.waitForComponentState(stateAfter);
    await this.waitToHaveValue(textValue);
  }


  public async click(): Promise<void> {
    await this.locator.click();
  }

}

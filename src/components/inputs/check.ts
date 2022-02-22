import { Component } from '../component';


export class CheckInput extends Component {

  protected checkValues: string[];


  public async checkOption(checked: boolean,
    stateAfter?: { hidden?: true, disabled?: true, invalid?: true | 'ignore' }
  ): Promise<void> {
    await this.locator.setChecked(checked);
    await this.waitForComponentState(stateAfter);
  }

}

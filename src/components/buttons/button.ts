import { Component } from '../component';


export class Button extends Component {

  public async click(options?: { noWaitAfter: boolean }): Promise<void> {
    await this.locator.click(options);
  }

}

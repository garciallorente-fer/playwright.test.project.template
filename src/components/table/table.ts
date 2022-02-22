import { ElementHandle } from '@playwright/test';
import { Component } from '../component';


export class Table extends Component {

  private async getRowElements(rowSelector: string): Promise<ElementHandle<Node>[]> {
    try {
      return await this.locator.locator(rowSelector).elementHandles();
    } catch (error: any) {
      throw new Error('TABLE.getRowElements() > ' + this.locator + '\n' + error.message);
    }
  }

  private async getTableDataElements(): Promise<ElementHandle<SVGElement | HTMLElement>[][]> {
    try {
      const rowsElements = await this.getRowElements('tr');
      return await Promise.all(rowsElements.map(async rowElement =>
        await rowElement.$$('td,th')
      ));
    } catch (error: any) {
      throw new Error('TABLE.getTableDataElements() > ' + this.locator + '\n' + error.message);
    }
  }

  public async getRowsData(): Promise<string[]> {
    const flatDataElements = (await this.getTableDataElements()).flat();
    try {
      return await Promise.all(flatDataElements.map(async flatDataElement =>
        await flatDataElement.innerText()
      ));
    } catch (error: any) {
      throw new Error('TABLE.getRowsData() > ' + this.locator + '\n' + error.message);
    }
  }

  public async getRowsAttribute(elementSelector: string, elementAttribute: string) {
    const rowsElements = await this.getRowElements(elementSelector);
    try {
      return await Promise.all(rowsElements.map(async rowElement => {
        const a = await rowElement.getAttribute(elementAttribute);
        if (a) {
          return a;
        }
      }));
    } catch (error: any) {
      throw new Error('TABLE.getRowsAttribute() > ' + this.locator + '\n' + error.message);
    }
  }

  public async getRowsArrays(): Promise<(string | null)[][]> {
    try {
      const tableDataElements = await this.getTableDataElements();
      return await Promise.all(tableDataElements.map(async tableDataElement =>
        await Promise.all(tableDataElement.map(async tableDataElement =>
          await tableDataElement.textContent()
        ))
      ));
    } catch (error: any) {
      throw new Error('TABLE.getRowsArrays() > ' + this.locator + '\n' + error.message);
    }
  }

}

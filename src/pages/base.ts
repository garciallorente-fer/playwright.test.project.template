import type { Page } from '@playwright/test';

import { expect } from '@playwright/test';


export class BasePage {

  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected url: string;


  public async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForURL();
  }

  public async waitForURL(): Promise<void> {
    const urlRegExp = this.url.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    await expect.soft(this.page).toHaveURL(new RegExp(urlRegExp));
  }


  public async takeScreenshot(path?: string): Promise<void> {
    await this.page.screenshot({ fullPage: true, path: path, animations: 'disabled' });
  }

  public async waitToMatchSnapshot(snapshotName: string): Promise<void> {
    expect.soft(await this.takeScreenshot()).toMatchSnapshot(`${snapshotName}.png`, { maxDiffPixels: 30 });
  }


  public async closePage(): Promise<void> {
    await this.page.close();
    expect.soft(this.page.isClosed()).toBeTruthy();
  }


  public async debugExecution(): Promise<void> {
    await this.page.pause();
  }


  protected getArrayOfArrays(arrayOfArrays: string[][], filterString: string): string[] {
    const array = arrayOfArrays.find(array =>
      array.some(arrayElement =>
        arrayElement?.toLowerCase().includes(filterString.toLowerCase())
      )
    );
    if (array) {
      return array;
    } else {
      throw new Error('Array element not found > ' + filterString + '\ninside array: \n' + arrayOfArrays);
    }
  }


  protected async getLocalStorageItem<Type>(key: string): Promise<Type> {
    const localStorageKeyValue = await this.page.evaluate((key) => localStorage.getItem(key), key);
    if (localStorageKeyValue === null) {
      throw new Error('No Local Storage Key Found');
    }
    return JSON.parse(localStorageKeyValue) as Type;
  }


  protected async getIndexedDbObject<Type>(
    dbName: string, dbVersion: number, tableName: string, objectName: string
  ): Promise<Type> {
    return await this.page.evaluate(([dbName, dbVersion, tableName, objectName]) => {
      return new Promise((resolve, reject) => {
        const openReq = indexedDB.open(dbName.toString(), parseInt(dbVersion.toString()));
        openReq.onsuccess = function (e: any) {
          const db = e.target.result;
          const tx = db.transaction(tableName, 'readonly');
          const store = tx.objectStore(tableName);
          const req = store.get(objectName);
          req.onsuccess = function (get: any) {
            resolve(get.target.result);
          };
          req.onerror = function (e: any) {
            reject(e);
          };
        };
        openReq.onerror = function (e: any) {
          reject(e);
        };
      });
    }, [dbName, dbVersion, tableName, objectName]);
  }

}

import type { Page, Response, Request, Route } from '@playwright/test';

import { expect } from '@playwright/test';


export type API = {
  readonly url: string
  readonly status: number
  readonly searchParams?: string[]
  readonly avoidParams?: string[]
}

export abstract class ApiInterception {

  static async waitForResponseObject<Type>(page: Page, api: API): Promise<Type> {
    const response = await this.waitForResponse(page, api);
    return await response.json() as Type;
  }

  static async waitForRequestObject<Type>(page: Page, api: API, requestMethod?: string): Promise<Type> {
    const request = await this.waitForRequest(page, api, requestMethod);
    const responseRequest = await request.response();
    try {
      responseRequest !== null && expect(responseRequest.status()).toEqual(api.status);
    } catch (error: any) {
      const requestDataJSON = await request.postDataJSON();
      throw new Error(
        `REQUEST.Object>
                "${api.url}" & "${api.searchParams}", with Status> "${api.status}" & AvoidParams> "${api.avoidParams}""
                \nREQUEST:\n${JSON.stringify(requestDataJSON)}`
      );
    }
    return await request.postDataJSON() as Type;
  }

  static async waitForRequestResponseObject<Type>(
    page: Page, api: API, requestMethod?: string
  ): Promise<Type> {
    const request = await this.waitForRequest(page, api, requestMethod);
    const responseRequest = await request.response();
    try {
      expect(responseRequest).not.toBeNull();
      expect(responseRequest?.status()).toEqual(api.status);
    } catch (error: any) {
      const responseRequestJSON = await responseRequest?.json();
      throw new Error(
        `REQUEST.RESPONSE.Object>
                "${api.url}" & "${api.searchParams}", with Status> "${api.status}" & AvoidParams> "${api.avoidParams}""
                \nRESPONSE:\n${JSON.stringify(responseRequestJSON)}`
      );
    }
    return await responseRequest?.json() as Type;
  }

  static async waitForRequestAndResponseObject<requestT, responseT>(
    page: Page, api: API, requestMethod?: string
  ): Promise<[requestT, responseT]> {
    const request = await this.waitForRequest(page, api, requestMethod);
    const responseRequest = await request.response();
    try {
      expect(responseRequest).not.toBeNull();
      expect(responseRequest?.status()).toEqual(api.status);
    } catch (error: any) {
      const requestDataJSON = await request.postDataJSON();
      const responseRequestJSON = await responseRequest?.json();
      throw new Error(
        `REQUEST & RESPONSE Objects>
                "${api.url}" & "${api.searchParams}", with Status> "${api.status}" & AvoidParams> "${api.avoidParams}""
                \nREQUEST:\n${JSON.stringify(requestDataJSON)}
                \nRESPONSE:\n${JSON.stringify(responseRequestJSON)}`
      );
    }
    return [await request.postDataJSON() as requestT, await responseRequest?.json() as responseT];
  }


  static async waitForResponseString(page: Page, api: API): Promise<string> {
    const response = await this.waitForResponse(page, api);
    return await response.text();
  }

  static async waitForRequestString(page: Page, api: API, requestMethod?: string): Promise<string | null> {
    const request = await this.waitForRequest(page, api, requestMethod);
    const responseRequest = await request.response();
    try {
      expect(responseRequest).not.toBeNull();
      expect(responseRequest?.status()).toEqual(api.status);
    } catch (error: any) {
      throw new Error(
        `REQUEST.String>
                "${api.url}" & "${api.searchParams}", with Status> "${api.status}" & AvoidParams> "${api.avoidParams}""
                \nREQUEST:\n${request.postData()}`
      );
    }
    return request.postData();
  }

  static async waitForResponseRequestString(page: Page, api: API, requestMethod?: string): Promise<string> {
    const request = await this.waitForRequest(page, api, requestMethod);
    const responseRequest = await request.response();
    try {
      expect(responseRequest).not.toBeNull();
      expect(responseRequest?.status()).toEqual(api.status);
    } catch (error: any) {
      const responseRequestText = await responseRequest?.text();
      throw new Error(
        `RESPONSE.REQUEST.String>
                "${api.url}" & "${api.searchParams}", with Status> "${api.status}" & AvoidParams> "${api.avoidParams}""
                \nREQUEST:\n${responseRequestText}`
      );
    }
    return await responseRequest?.text() as string;
  }


  static async waitForResponse(page: Page, api: API): Promise<Response> {
    const allResponses: string[] = [];
    try {
      return await page.waitForResponse(
        (response: Response) => {
          if (ApiInterception.urlIncludes(response.url(), api.url, api.searchParams)
            && ApiInterception.urlNotIncludes(response.url(), api.avoidParams)
            && api.status === response.status()
          ) {
            return true;
          }
          if (ApiInterception.urlIncludes(response.url(), api.url)) {
            allResponses.push(response.url() + ' Status:' + response.status());
          }
          return false;
        }
      );
    } catch (error: any) {
      throw new Error(
        `RESPONSE>
                "${api.url}" & "${api.searchParams}", with Status> "${api.status}" & AvoidParams> "${api.avoidParams}""
                \nResponses list:\n${allResponses.join('\n')}
                \n{${error.message}}`
      );
    }
  }


  static async waitForRequest(page: Page, api: API, requestMethod?: string): Promise<Request> {
    const allRequests: string[] = [];
    try {
      return await page.waitForRequest(
        async (request: Request) => {
          if (ApiInterception.urlIncludes(request.url(), api.url, api.searchParams)
            && ApiInterception.urlNotIncludes(request.url(), api.avoidParams)
            && request.failure() === null
            && (!requestMethod || request.method() === requestMethod)
          ) {
            const response = await request.response();
            if (api.status === response?.status()) {
              return true;
            }
          }
          if (ApiInterception.urlIncludes(request.url(), api.url)) {
            allRequests.push(request.url() + ' Status:' + request.failure());
          }
          return false;
        }
      );
    } catch (error: any) {
      throw new Error(
        `REQUEST>
                "${api.url}" & "${api.searchParams}", with Status> "${api.status}" & AvoidParams> "${api.avoidParams}"
                \nRequests list:\n${allRequests.join('\n')}
                \n{${error.message}}`
      );
    }
  }


  static async mock(page: Page, api: API, mockFilePath: string): Promise<(url: URL) => boolean> {
    const apiUrl = (url: URL) => ApiInterception.urlIncludes(url.toString(), api.url, api.searchParams);
    const mockRoute = (route: Route) => route.fulfill({ status: api.status, path: mockFilePath });
    await page.route(apiUrl, mockRoute);
    return apiUrl;
  }

  static async unmock(page: Page, apiUrl: (url: URL) => boolean): Promise<void> {
    await page.unroute(apiUrl);
  }


  private static urlIncludes(url: string, apiUrl: string, params?: string[]): boolean {
    url = url.toLowerCase();
    return (
      url.includes(apiUrl.toLowerCase())
      && (params ? params.every(param => url.includes(encodeURI(param).toLowerCase())) : true)
    );
  }

  private static urlNotIncludes(url: string, avoidParams?: string[]): boolean {
    url = url.toLowerCase();
    return (
      avoidParams ? avoidParams.every(avoidParam => !url.includes(encodeURI(avoidParam).toLowerCase())) : true
    );
  }

}

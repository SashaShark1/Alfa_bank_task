import { type APIRequestContext, type APIResponse, expect, test } from '@playwright/test';

export class MarketAPI {
  constructor(public request: APIRequestContext) {
  }

  async clearBasket(): Promise<APIResponse | undefined> {
    return await test.step(`Выполнить запрос для очистки корзины`, async () => {
      try {
        return await this.request.post(`${process.env.URL}/basket/clear`);
      } catch (e) {
        console.error(e);
      }
    });
  }
}
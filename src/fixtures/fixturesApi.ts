import { expect, test as base } from '@playwright/test';

import { MarketAPI } from '../api/requests';

type fixturesApi = {
  marketApi: MarketAPI;
  clearCart: any;
};

export const test = base.extend<fixturesApi>({
  clearCart: async ({ marketApi }, use) => {
    const response = await marketApi.clearBasket();
    expect(response.status()).toBe(200);
    await use();
  },

  marketApi: async ({ request }, use) => {
    await use(new MarketAPI(request));
  },
});

import { expect, test as base } from '@playwright/test';
import { MarketAPI } from '../api/requests';

type fixturesApi = {
  marketApi: MarketAPI;
  clearCart: any;
}

export const test = base.extend<fixturesApi>({
  marketApi: async ({ request }, use) => {
    await use(new MarketAPI(request));
  },


clearCart: async ({ marketApi }, use) => {
  const response = await marketApi.clearBasket()
  console.log( response.url())
  console.log( response.status())
  // expect(response.status()).toBe(200);
  // await use();
},
})
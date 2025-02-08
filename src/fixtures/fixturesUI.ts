import { test as base } from '@playwright/test';
import { MarketPage } from '../pages/marketPage';



type fixturesUi = {
  marketPage: MarketPage;
}

export const test = base.extend<fixturesUi>({
  marketPage: async ({ page }, use) => {
    await use(new MarketPage(page));
  },
})
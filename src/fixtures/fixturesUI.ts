import { test as base } from '@playwright/test';

import { Verification } from '../helpers/verification';
import { AuthPage } from '../pages/authPage';
import { MarketPage } from '../pages/marketPage';

type fixturesUi = {
  authPage: AuthPage;
  clearBasketUI: any;
  marketPage: MarketPage;
  verification: Verification;
};

export const test = base.extend<fixturesUi>({
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },

  clearBasketUI: async ({ marketPage }, use) => {
    await marketPage.clearBasketWithUI();
    await use();
  },

  marketPage: async ({ page }, use) => {
    await use(new MarketPage(page));
  },

  // eslint-disable-next-line no-empty-pattern
  verification: async ({}, use) => {
    await use(new Verification());
  },
});

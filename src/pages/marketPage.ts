import { type Locator, test } from '@playwright/test';
import { BasePage } from './basePage';

export class MarketPage extends BasePage {
  readonly basketBtn: Locator = this.page.locator('li#basketContainer');
readonly basketForm = {
  container: this.page.locator('[aria-labelledby="dropdownBasket"]'),
}

  async goTo(): Promise<void> {
    await super.goTo(`${process.env.URL}`);
  }

  async openBasketForm(): Promise<void> {
    await test.step(`Открыть корзину с товарами:`, async () => {
    })
  }
}
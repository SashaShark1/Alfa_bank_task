import { expect, type Locator, test } from '@playwright/test';

import { Verification } from '../helpers/verification';
import { BasePage } from './basePage';

const verification = new Verification();
export class MarketPage extends BasePage {
  // LOCATORS
  readonly basketBtn: Locator = this.page.locator('a#dropdownBasket');
  readonly itemCount: Locator = this.page.locator('//span[contains(@class,"basket-count-items")]');

  readonly basketForm = {
    clearBtn: this.page.locator('//div[contains(@class,"actionClearBasket")]'),
    container: this.page.locator('[aria-labelledby="dropdownBasket"]'),
    orderBtn: this.page.locator('[href="/basket"]'),
    price: this.page.locator('span.basket_price'),
  };

  readonly purchase = {
    count: this.page.locator('[aria-labelledby="dropdownBasket"]'),
    item: this.page.locator('//li[contains(@class,"basket-item")]'),
  };

  readonly products = {
    // cardNoDiscount: this.page
    //   .locator('//div[contains(@class,"note-item") and not(contains(@class, "hasDiscount")]')
    //   .first(),
    container: this.page.locator('//div[contains(@class,"note-list")]'),
  };

  async getProductsWithoutDiscount(): Promise<Locator> {
    return this.page.locator(`//div[contains(@class,"note-item") and not(contains(@class, "hasDiscount"))]`);
  }

  async getProductsWithDiscount(): Promise<Locator> {
    return this.page.locator(`//div[contains(@class,"note-item") and contains(@class, "hasDiscount")]`);
  }

  // METHODS
  async goTo(): Promise<void> {
    await super.goTo(`${process.env.URL}`);
  }

  async openBasketPreviewForm(): Promise<void> {
    await test.step(`Открыть корзину с товарами:`, async () => {
      await this.clickButton(this.basketBtn, 'Корзина', true);
      await verification.checkVisibleState(this.basketForm.container);
    });
  }

  async getCountItem(): Promise<string> {
    await this.page.waitForSelector('#basketContainer> span');
    return await this.itemCount.textContent();
  }

  async clearBasketWithUI(): Promise<void> {
    const items = await this.getCountItem();
    if (parseInt(items)) {
      await this.openBasketPreviewForm();
      await test.step(`Очистить корзину с товарами:`, async () => {
        const responsePromise = this.page.waitForResponse(
          response => response.url().includes('basket/clear') && response.status() === 200,
        );
        await this.clickButton(this.basketForm.clearBtn, 'Очистить корзину');
        await responsePromise;
        await this.page.waitForTimeout(1000);
        const count = await this.getCountItem();
        expect(+count, 'Проверить, что в корзине нет товаров').toEqual(0);
      });
    } else {
      console.log('Корзина пуста');
    }
  }

  async openOrderForm(): Promise<void> {
    await test.step(`Перейти на страницу оформления заказа:`, async () => {
      await this.clickButton(this.basketForm.orderBtn, 'Перейти в корзину');
      expect(this.page.url(), 'Проверить, что произошёл переход на страницу оформления заказа').toContain(
        'basket',
      );
    });
  }

  // async findFullPriceProduct(): Promise<void> {
  //   await test.step(`Найти неакционный товар:`, async () => {
  //     const itemsWithoutDiscount = await this.getProductsWithoutDiscount();
  //     const item = itemsWithoutDiscount.first();
  //     console.log(await item.textContent());
  //     // const itemsWithoutDiscount = this.products.card.filter({ hasNot: this.page.locator('.hasDiscount') });
  //     // await this.page.waitForTimeout(1000);
  //     // console.log(itemsWithoutDiscount.textContent());
  //     // expect(this.page.url(), 'Проверить, что произошёл переход на страницу оформления заказа').toContain(
  //     //   'basket',
  //   });
  // }
}

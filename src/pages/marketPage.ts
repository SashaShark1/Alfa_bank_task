import { expect, type Locator, test } from '@playwright/test';

import { Verification } from '../helpers/verification';
import { BasePage } from './basePage';

const verification = new Verification();
const WAITER = 2000;

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
    container: this.page.locator('//div[contains(@class,"note-list")]'),
  };

  async getProductsWithoutDiscount(): Promise<Locator> {
    return await test.step(`Найти неакционный товар:`, async () => {
      return this.page
        .locator(`//div[contains(@class,"note-item") and not(contains(@class, "hasDiscount"))]`)
        .first();
    });
  }

  async getProductsWithDiscount(): Promise<Locator> {
    return await test.step(`Найти акционный товар:`, async () => {
      return this.page
        .locator(`//div[contains(@class,"note-item") and contains(@class, "hasDiscount")]`)
        .first();
    });
  }

  async getPaginationBtn(num: number): Promise<Locator> {
    return this.page.locator(`//ul[contains(@class, "pagination")]//li[${num}]`);
  }

  async getProductItem(num: number): Promise<Locator> {
    return this.products.container.locator(`//div[contains(@class, "col-3")][${num}]`);
  }

  async getPurchaseItem(num: number): Promise<Locator> {
    return this.page.locator(`//ul[contains(@class, "list-group")]//li[${num}]`);
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
    // await this.page.waitForTimeout(WAITER);
    return await this.itemCount.textContent();
  }

  async clearBasketWithUI(): Promise<void> {
    const items = await this.getCountItem();
    if (parseInt(items)) {
      await this.openBasketPreviewForm();
      await test.step(`Очистить корзину с товарами:`, async () => {
        // const responsePromise = this.page.waitForResponse(
        //   response => response.url().includes('basket/clear') && response.status() === 200,
        // );
        await this.clickButton(this.basketForm.clearBtn, 'Очистить корзину');
        // await responsePromise;
        await this.page.waitForTimeout(WAITER);
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

  async clickBuyBtnInCard(product: Locator): Promise<void> {
    await test.step(`Кликнуть по кнопке "Купить" возле выбранного товара:`, async () => {
      const buyBtn = product.locator('//button[contains(@class, "actionBuyProduct")]');
      await this.clickButton(buyBtn, 'Купить', true);
    });
  }

  async getProductName(product: Locator): Promise<string | null> {
    return await test.step(`Обратить внимание на название выбранного товара в карточке:`, async () => {
      const productNameLocator = product.locator('//div[contains(@class, "product_name")]');
      return await productNameLocator.textContent();
    });
  }

  async getProductPrice(product: Locator): Promise<string | null> {
    return await test.step(`Обратить внимание на цену выбранного товара в карточке:`, async () => {
      const priceLocator = product.locator('//span[contains(@class, "product_price")]');
      return await priceLocator.textContent();
    });
  }

  async getDiscountProductPrice(product: Locator): Promise<string | null> {
    return await test.step(`Получить цену выбранного акционного товара в карточке:`, async () => {
      const price = await this.getProductPrice(product);
      return price.split('р.')[0];
    });
  }

  async fillCountOfProducts(product: Locator, count: string): Promise<void> {
    await test.step(`Ввести необходимое количество товаров в карточке выбранного товара:`, async () => {
      const countField = product.locator('[name="product-enter-count"]');
      await this.fillInput(countField, 'Количество товара', count);
    });
  }

  async clickPaginationBtn(num: number): Promise<void> {
    const paginationBtn = await this.getPaginationBtn(num);
    await test.step(`Кликнуть по кнопке пагинации  "${num}"`, async () => {
      await this.page.waitForLoadState('domcontentloaded');
      await paginationBtn.click();
      await this.page.waitForTimeout(500);
    });
  }
}

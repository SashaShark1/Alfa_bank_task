import { expect } from '@playwright/test';
import { test } from '../src/fixtures/fixturesMerged';
import { allure } from 'allure-playwright';

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ authPage, marketPage }) => {
    await authPage.goTo();
    await authPage.login(process.env.CREDENTIALS, process.env.CREDENTIALS);
  });

  // test.beforeEach(async ({ marketPage }) => {
  //   await marketPage.goTo();
  // });

  test('Тест-кейс 1. Переход в пустую корзину', async ({ clearBasketUI, marketPage }) => {
    await marketPage.openBasketPreviewForm();
    await marketPage.openOrderForm();
  });

  test('Тест-кейс 2. Переход в корзину с 1 неакционным товаром', async ({ clearBasketUI, marketPage, page }) => {
    await test.step(`Найти неакционный товар:`, async () => {
      const itemsWithoutDiscount = await marketPage.getProductsWithoutDiscount();
      const product = itemsWithoutDiscount.first();
      const buyBtn = product.locator('//button[contains(@class, "actionBuyProduct")]');
      await marketPage.clickButton(buyBtn, 'Купить');
      await page.waitForTimeout(500);
      const itemCount = await marketPage.getCountItem();
      expect(+itemCount).toEqual(1);
      //шаг2
      await marketPage.openBasketPreviewForm();
      const count = await marketPage.purchase.item.count();
      expect(count).toEqual(1);
      const itemText = await marketPage.purchase.item.textContent();
      const productNameLocator = product.locator('//div[contains(@class, "product_name")]');
      const productName = await productNameLocator.textContent();
      expect(itemText).toContain(productName);
      const priceLocator = product.locator('//span[contains(@class, "product_price")]');
      const price = await priceLocator.textContent();
      expect(itemText).toContain(price);
      const basketPrice = await marketPage.basketForm.price.textContent();
      expect(parseInt(price)).toEqual(+basketPrice);
      await marketPage.openOrderForm();
    });
  });

  test('Тест-кейс 3. Переход в корзину с 1 акционным товаром', async ({ clearBasketUI, marketPage, page }) => {
    await test.step(`Найти акционный товар:`, async () => {
      const itemsWithDiscount = await marketPage.getProductsWithDiscount();
      const product = itemsWithDiscount.last();
      const buyBtn = product.locator('//button[contains(@class, "actionBuyProduct")]');
      await marketPage.clickButton(buyBtn, 'Купить');
      await page.waitForTimeout(500);
      const itemCount = await marketPage.getCountItem();
      expect(+itemCount).toEqual(1);
      //шаг2
      await marketPage.openBasketPreviewForm();
      const count = await marketPage.purchase.item.count();
      expect(count).toEqual(1);
      const itemText = await marketPage.purchase.item.textContent();
      console.log('itText:', itemText);
      const productNameLocator = product.locator('//div[contains(@class, "product_name")]');
      const productName = await productNameLocator.textContent();
      console.log('name:', productName);
      expect(itemText).toContain(productName);
      const priceLocator = product.locator('//span[contains(@class, "product_price")]');
      const price = await priceLocator.textContent();
      console.log('pr:', price);
      const discountPrice = price.split('р.')[0];
      console.log('disc:', discountPrice);
      expect(itemText).toContain(discountPrice);
      const basketPrice = await marketPage.basketForm.price.textContent();
      console.log('bask:', basketPrice);
      expect(parseInt(discountPrice)).toEqual(+basketPrice);
      await marketPage.openOrderForm();
    });
  });
});

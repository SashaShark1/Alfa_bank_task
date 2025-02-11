import { expect } from '@playwright/test';
import { test } from '../src/fixtures/fixturesMerged';

const MIN_VALUE = 1;
const MAX_VALUE = 8;
const WAITER_500 = 1000;

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.goTo();
    await authPage.login(process.env.CREDENTIALS as string, process.env.CREDENTIALS as string);
  });

  test.beforeEach(async ({ clearBasketUI }) => {
    const clear = clearBasketUI;
  });

  test('Тест-кейс 2. Переход в корзину с 1 неакционным товаром', async ({ marketPage, page }) => {
    const product = await marketPage.getProductsWithoutDiscount();
    await marketPage.clickBuyBtnInCard(product);
    await page.waitForTimeout(WAITER_500);
    const itemCount = await marketPage.getCountItem();
    expect(+itemCount, `Проверить, что возле корзины отображется цифра ${MIN_VALUE}`).toEqual(MIN_VALUE);
    await marketPage.openBasketPreviewForm();
    const count = await marketPage.purchase.item.count();
    expect(count, `Проверить, что в корзине ${MIN_VALUE} наименование товара`).toEqual(MIN_VALUE);
    const itemText = await marketPage.purchase.item.textContent();
    const productName = await marketPage.getProductName(product);
    expect(
      itemText,
      `Проверить, что в корзине отображается название выбранного товара - ${productName}`,
    ).toContain(productName);
    const price = await marketPage.getProductPrice(product);
    expect(itemText, `Проверить, что в корзине отображается цена выбранного товара - ${price}`).toContain(price);
    const basketPrice = await marketPage.basketForm.price.textContent();
    expect(
      parseInt(price as string),
      `Проверить, что стоимость товаров в корзине соответствует цене товара - ${price}`,
    ).toEqual(+basketPrice);
    await marketPage.openOrderForm();
  });

  test('Тест-кейс 3. Переход в корзину с 1 акционным товаром', async ({ marketPage, page }) => {
    const product = await marketPage.getProductsWithDiscount();
    await marketPage.clickBuyBtnInCard(product);
    await page.waitForTimeout(WAITER_500);
    const itemCount = await marketPage.getCountItem();
    expect(+itemCount, `Проверить, что возле корзины отображется цифра ${MIN_VALUE}`).toEqual(MIN_VALUE);
    await marketPage.openBasketPreviewForm();
    const count = await marketPage.purchase.item.count();
    expect(count, `Проверить, что в корзине ${MIN_VALUE} наименование товара`).toEqual(MIN_VALUE);
    const itemText = await marketPage.purchase.item.textContent();
    const productName = await marketPage.getProductName(product);
    expect(
      itemText,
      `Проверить, что в корзине отображается название выбранного товара - ${productName}`,
    ).toContain(productName);
    const discountPrice = await marketPage.getDiscountProductPrice(product);
    expect(
      itemText,
      `Проверить, что в корзине отображается акционная цена выбранного товара - ${discountPrice}`,
    ).toContain(discountPrice);
    const basketPrice = await marketPage.basketForm.price.textContent();
    expect(
      +basketPrice,
      `Проверить, что стоимость товаров в корзине соответствует акционной цене товара - ${discountPrice}`,
    ).toEqual(+discountPrice);
    await marketPage.openOrderForm();
  });

  test('Тест-кейс 5. Переход в корзину с 9 акционными товарами одного наименования', async ({
    marketPage,
    page,
  }) => {
    const product = await marketPage.getProductsWithDiscount();
    await marketPage.fillCountOfProducts(product, MAX_VALUE.toString());
    await marketPage.clickBuyBtnInCard(product);
    await page.waitForTimeout(WAITER_500);
    const itemCount = await marketPage.getCountItem();
    expect(+itemCount, `Проверить, что возле корзины отображется цифра ${MAX_VALUE}`).toEqual(MAX_VALUE);
    await marketPage.openBasketPreviewForm();
    const count = await marketPage.purchase.item.count();
    expect(count, `Проверить, что в корзине 1 наименование товара`).toEqual(1);
    const itemText = await marketPage.purchase.item.textContent();
    const productName = await marketPage.getProductName(product);
    expect(
      itemText,
      `Проверить, что в корзине отображается название выбранного товара - ${productName}`,
    ).toContain(productName);
    const discountPrice = await marketPage.getDiscountProductPrice(product);
    const totalAmount = parseInt(discountPrice) * MAX_VALUE;
    expect(
      itemText,
      `Проверить, что в корзине отображается стоимость ${MAX_VALUE} товаров по акционной цене - ${discountPrice}`,
    ).toContain(totalAmount.toString());
    const basketPrice = await marketPage.basketForm.price.textContent();
    expect(+basketPrice, `Проверить, что стоимость товаров в корзине соответствует ${totalAmount}`).toEqual(
      +totalAmount,
    );
    await marketPage.openOrderForm();
  });

  test('Тест-кейс 1. Переход в пустую корзину', async ({ marketPage }) => {
    await marketPage.openBasketPreviewForm();
    await marketPage.openOrderForm();
  });

  test('Тест-кейс 4. Переход в корзину с 9 разными товарами', async ({ addProduct, marketPage, page }) => {
    let priceArr: string[] = [];
    let nameArr: string[] = [];
    const [price, name] = await addProduct;
    nameArr.push(name);

    await marketPage.clickPaginationBtn(1);
    await page.waitForTimeout(WAITER_500);

    for (let i = 1; i < MAX_VALUE; i++) {
      const product = await marketPage.getProductItem(i);
      await marketPage.clickBuyBtnInCard(product);
      await page.waitForTimeout(WAITER_500);
      const itemCount = await marketPage.getCountItem();
      expect(+itemCount, `Проверить, что возле корзины отображется цифра ${i}`).toEqual(i + 1);
      const productName = await marketPage.getProductName(product);
      nameArr.push(productName);
      const discountPrice = await marketPage.getDiscountProductPrice(product);
      priceArr.push(discountPrice);
    }
    await marketPage.openBasketPreviewForm();
    const count = await marketPage.purchase.item.count();
    expect(count, `Проверить, что в корзине ${MAX_VALUE} наименований товара`).toEqual(MAX_VALUE);

    const totalAmount = priceArr.reduce((acc, item) => {
      return (acc += parseInt(item));
    }, +price);

    const basketPrice = await marketPage.basketForm.price.textContent();
    expect(+basketPrice, `Проверить, что стоимость товаров в корзине соответствует ${totalAmount}`).toEqual(
      totalAmount,
    );

    for (let i = 1; i < MAX_VALUE; i++) {
      const purchase = await marketPage.getPurchaseItem(i);
      const itemText = await purchase.textContent();
      expect(itemText, `${i}`).toContain(nameArr[i - 1]);
    }
    await marketPage.openOrderForm();
  });
});

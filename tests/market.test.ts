import { expect } from '@playwright/test';
import { test } from '../src/fixtures/fixturesMerged';

const MIN_VALUE = 1;
const MAX_VALUE = 9;
const WAITER = 1000;

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ authPage }) => {
    await authPage.goTo();
    await authPage.login(process.env.CREDENTIALS as string, process.env.CREDENTIALS as string);
  });

  test.beforeEach(async ({ clearBasketUI }) => {
    // const clear = clearBasketUI;
  });

  test('Тест-кейс 2. Переход в корзину с 1 неакционным товаром', async ({ marketPage, page }) => {
    const product = await marketPage.getProductsWithoutDiscount();
    await marketPage.clickBuyBtnInCard(product);
    await page.waitForTimeout(WAITER);
    const itemCount = await marketPage.getCountItem();
    expect(itemCount, `Проверить, что возле корзины отображется цифра ${MIN_VALUE}`).toEqual(MIN_VALUE);
    await marketPage.openBasketPreviewForm();
    await marketPage.checkItemCountInBasket(MIN_VALUE);
    await marketPage.checkProductNameInBasket(product);
    await marketPage.checkProductPriceInBasket(product);
    const price = await marketPage.getProductPrice(product);
    await marketPage.checkTotalAmountInBasket(price as number);
    await marketPage.openOrderForm();
  });

  test('Тест-кейс 3. Переход в корзину с 1 акционным товаром', async ({ marketPage, page }) => {
    const product = await marketPage.getProductsWithDiscount();
    await marketPage.clickBuyBtnInCard(product);
    await page.waitForTimeout(WAITER);
    const itemCount = await marketPage.getCountItem();
    expect(itemCount, `Проверить, что возле корзины отображется цифра ${MIN_VALUE}`).toEqual(MIN_VALUE);
    await marketPage.openBasketPreviewForm();
    await marketPage.checkItemCountInBasket(MIN_VALUE);
    await marketPage.checkProductNameInBasket(product);
    await marketPage.checkProductPriceInBasket(product);
    const price = await marketPage.getProductPrice(product);
    await marketPage.checkTotalAmountInBasket(price as number);
    await marketPage.openOrderForm();
  });

  test('Тест-кейс 5. Переход в корзину с 9 акционными товарами одного наименования', async ({
    marketPage,
    page,
  }) => {
    const product = await marketPage.getProductsWithDiscount();
    await marketPage.fillCountOfProducts(product, MAX_VALUE.toString());
    await marketPage.clickBuyBtnInCard(product);
    await page.waitForTimeout(WAITER);
    const itemCount = await marketPage.getCountItem();
    expect(itemCount, `Проверить, что возле корзины отображется цифра ${MAX_VALUE}`).toEqual(MAX_VALUE);
    await marketPage.openBasketPreviewForm();
    await marketPage.checkItemCountInBasket(MIN_VALUE);
    await marketPage.checkProductNameInBasket(product);
    const itemText = await marketPage.purchase.item.textContent();
    const discountPrice = await marketPage.getProductPrice(product);
    const totalAmount = (discountPrice as number) * MAX_VALUE;
    expect(
      itemText,
      `Проверить, что в корзине отображается стоимость ${MAX_VALUE} товаров по акционной цене - ${discountPrice}`,
    ).toContain(totalAmount.toString());
    await marketPage.checkTotalAmountInBasket(totalAmount);
    await marketPage.openOrderForm();
  });

  test('Тест-кейс 4. Переход в корзину с 9 разными товарами', async ({ addProduct, marketPage, page }) => {
    let priceArr: string[] = [];
    let nameArr: string[] = [];
    const [price, name] = await addProduct;
    nameArr.push(name);

    await marketPage.clickPaginationBtn(1);

    await test.step(`Добавить в корзину необходимое количество товаров - ${MAX_VALUE}`, async () => {
      for (let i = 1; i < MAX_VALUE; i++) {
        const product = await marketPage.getProductItem(i);
        await marketPage.clickBuyBtnInCard(product);
        await page.waitForTimeout(WAITER);
        const itemCount = await marketPage.getCountItem();
        expect(itemCount, `Проверить, что возле корзины отображется цифра ${i}`).toEqual(i + 1);
        const productName = await marketPage.getProductName(product);
        nameArr.push(productName);
        const discountPrice = await marketPage.getProductPrice(product);
        priceArr.push(discountPrice);
      }
    });
    await marketPage.openBasketPreviewForm();
    await marketPage.checkItemCountInBasket(MAX_VALUE);

    await test.step(`Проверить, что в корзине отображаются все добавленные товары`, async () => {
      for (let i = 1; i < MAX_VALUE; i++) {
        const purchase = await marketPage.getPurchaseItem(i);
        const itemText = await purchase.textContent();
        expect(itemText, `${i}`).toContain(nameArr[i - 1]);
      }
    });
    const totalAmount = priceArr.reduce((acc, item) => {
      return (acc += parseInt(item));
    }, +price);
    await marketPage.checkTotalAmountInBasket(totalAmount);
    await marketPage.openOrderForm();
  });

  test('Тест-кейс 1. Переход в пустую корзину', async ({ marketPage }) => {
    await marketPage.openBasketPreviewForm();
    await marketPage.openOrderForm();
  });
});

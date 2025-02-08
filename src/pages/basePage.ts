import { expect, Locator, type Page, test } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async goTo(url: string): Promise<void> {
    await test.step(`Перейти на страницу ${url}`, async () => {
      await this.page.goto(url);
      await this.page.waitForLoadState('domcontentloaded');
    });
  }

  async clickButton(button: Locator, name: string,  force: boolean = false): Promise<void> {
    if (!force) {
      await test.step(`Нажать кнопку "${name}"`, async () => {
        const enable = await button.isEnabled();
        expect(enable).toBeTruthy();
        await button.click();
      });
    } else {
      await test.step(`Нажать кнопку "${name}"`, async () => {
        const enable = await button.isEnabled();
        expect(enable).toBeTruthy();
        await button.click({ force: true });
      });
    }
  }

  async fillInput(locator: Locator, name: string, text: string): Promise<void> {
    await test.step(`Заполнить поле "${name}" значением "${text}"`, async () => {
      await locator.focus();
      await locator.clear();
      await locator.fill(text);
      await expect(locator, `Проверить, что в поле ${name} отображается введённое значение`).toHaveValue(text);
      await locator.blur();
    });
  }

  async hoverElement(locator: Locator, name: string): Promise<void> {
    await test.step(`Навести мышкой на элемент "${name}"`, async () => {
      const enable = await locator.isEnabled();
      expect(enable).toBeTruthy();
      await locator.hover();
    });
  }

  async customReload(): Promise<void> {
    await test.step(`Перезагрузить страницу`, async () => {
      await this.page.reload();
      await this.page.waitForLoadState('domcontentloaded');
    });
  }

  async typeInput(locator: Locator, name: string, text: string, num: number = 0): Promise<void> {
    await test.step(`Заполнить поле "${name}" значением "${text}"`, async () => {
      await locator.clear();
      await locator.focus();
      await locator.pressSequentially(text, { delay: num });
      await expect(locator, `Проверить, что в поле ${name} отображается введённое значение`).toHaveValue(text);
      await locator.blur();
    });
  }

  async clickOutBlock(): Promise<void> {
    await this.page.mouse.click(0, 0);
  }

  public async checkURL(text: string, url: string): Promise<void> {
    await test.step(`Проверить, что выполнен переход на ${text}`, async () => {
      expect(this.page.url()).toContain(url);
    });
  }
}

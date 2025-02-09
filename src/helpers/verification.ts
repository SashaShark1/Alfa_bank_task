import { expect, type Locator, test } from '@playwright/test';

export class Verification {
  public async checkMessage(locator: Locator, message: string): Promise<void> {
    await test.step(`Проверить, что на форме отображается сообщение "${message}"`, async () => {
      await locator.waitFor({ state: 'visible' });
      await expect(locator).toContainText(message);
    });
  }

  public async checkInputValue(locator: Locator, value: string): Promise<void> {
    await test.step(`Проверить, что в поле отображается введённое значение "${value}"`, async () => {
      await locator.waitFor({ state: 'visible' });
      await expect(locator).toHaveValue(value);
    });
  }

  public async checkStateButton(locator: Locator, buttonName: string, enabled: boolean = false): Promise<void> {
    if (enabled) {
      await test.step(`Проверить, что в кнопка "${buttonName}" активна`, async () => {
        await expect(locator).not.toBeDisabled();
      });
    } else {
      await test.step(`Проверить, что в кнопка "${buttonName}" неактивна`, async () => {
        await expect(locator).toBeDisabled();
      });
    }
  }

  public async checkVisibleButton(locator: Locator, buttonName: string): Promise<void> {
    await test.step(`Проверить, что в кнопка "${buttonName}" отображается на форме`, async () => {
      await expect(locator).toBeVisible();
    });
  }

  public async checkColor(locator: Locator, value: string): Promise<void> {
    await test.step(`Проверить, что у выбранного элемента изменился цвет`, async () => {
      await locator.waitFor({ state: 'visible' });
      await expect(locator).toHaveCSS('color', value);
    });
  }

  public async checkBackGround(locator: Locator, value: string): Promise<void> {
    await test.step(`Проверить, что у выбранного элемента изменился фоновый цвет`, async () => {
      await locator.waitFor({ state: 'visible' });
      await expect(locator).toHaveCSS('background-color', value);
    });
  }

  public async checkBorderColor(locator: Locator, value: string): Promise<void> {
    await test.step(`Проверить, что у выбранного элемента изменился цвет границ`, async () => {
      await locator.waitFor({ state: 'visible' });
      await expect(locator).toHaveCSS('border-color', value);
    });
  }

  public async checkClassValue(locator: Locator, value: string | RegExp): Promise<void> {
    await test.step(`Проверить, что у выбранного элемента изменился фоновый цвет`, async () => {
      await locator.waitFor({ state: 'visible' });
      await expect(locator).toHaveClass(value);
    });
  }

  async checkHiddenState(locator: Locator): Promise<void> {
    await test.step(`Проверить, что элемент не отображается на странице`, async () => {
      await locator.waitFor({ state: 'hidden' });
      const visibility = await locator.isHidden();
      expect(visibility).toBeTruthy();
    });
  }

  async checkVisibleState(locator: Locator): Promise<void> {
    await test.step(`Проверить, что элемент отображается на странице`, async () => {
      await locator.waitFor({ state: 'visible' });
      const visibility = await locator.isVisible();
      expect(visibility).toBeTruthy();
    });
  }

  public async checkTextContent(locator: Locator, value: string): Promise<void> {
    await test.step(`Проверить, что на форме отображается выбранное значение "${value}"`, async () => {
      await locator.waitFor({ state: 'visible' });
      await expect(locator).toContainText(value);
    });
  }

  public async checkAttribute(locator: Locator, name: string, value: string | RegExp): Promise<void> {
    await test.step(`Проверить, что у выбранного элемента есть аттрибут ${name}==${value}`, async () => {
      await locator.waitFor({ state: 'visible' });
      await expect(locator).toHaveAttribute(name, value);
    });
  }
}

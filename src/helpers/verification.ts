import { expect, type Locator, test } from '@playwright/test';

export class Verification {
  public async checkMessage(locator: Locator, message: string): Promise<void> {
    await test.step(`Проверить, что на форме отображается сообщение "${message}"`, async () => {
      await locator.waitFor({ state: 'visible' });
      await expect(locator).toContainText(message);
    });
  }

  public async checkVisibleButton(locator: Locator, buttonName: string): Promise<void> {
    await test.step(`Проверить, что в кнопка "${buttonName}" отображается на форме`, async () => {
      await expect(locator).toBeVisible();
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
}

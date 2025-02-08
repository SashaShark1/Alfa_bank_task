import { type Locator, test } from '@playwright/test';
import { BasePage } from './basePage';

export class AuthPage extends BasePage {
  readonly loginInput: Locator = this.page.locator('input#loginform-username');
  readonly passwordInput: Locator = this.page.locator('input#loginform-password');
  readonly loginBtn: Locator = this.page.locator('[name="login-button"]');


  async goTo(): Promise<void> {
    await super.goTo(`${process.env.URL}/login`);
  }

  async login(login: string, password: string): Promise<void> {
    await test.step(`Выполнить попытку авторизации в приложении:`, async () => {
    await this.typeInput(this.loginInput, 'Логин', login);
    await this.typeInput(this.passwordInput, 'Пароль', password);
    await this.clickButton(this.loginBtn, 'Вход')
  })
  }
}
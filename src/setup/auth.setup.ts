import { test as setup } from '@playwright/test';
import { AuthPage } from '../pages/authPage';


const authFile = 'playwright/.auth/user.json';

setup('Авторизация как админ', async ({ page }) => {
  const authPage = new AuthPage(page);

  await authPage.goTo();
  await authPage.login(process.env.CREDENTIALS, process.env.CREDENTIALS);

  await page.context().storageState({ path: authFile });
});

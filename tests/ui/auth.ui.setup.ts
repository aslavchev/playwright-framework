import { test as setup, expect } from '../../fixtures/pom/test-options';
import { Users } from '../../test-data/users';

setup('auth user', async ({ loginPage, page }) => {
    await setup.step('create logged in user session', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);
        await expect(page).toHaveURL(/inventory/);
        await page.context().storageState({ path: '.auth/userSession.json' });
    });
});

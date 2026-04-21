import { test, expect } from '../../fixtures/pom/test-options';
import { Users } from '../../test-data/users';

test.describe('Login', () => {
    // Login tests must not inherit the saved auth state — they test the login UI itself.
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.navigateToLoginPage();
    });

    test(
        'standard user logs in successfully',
        { tag: ['@smoke', '@ui'] },
        async ({ loginPage, page }) => {
            await test.step('login with standard user credentials', async () => {
                await loginPage.login(
                    Users.STANDARD.username,
                    Users.STANDARD.password
                );
            });

            await test.step('verify redirect to inventory page', async () => {
                await expect(page).toHaveURL(/inventory/);
            });
        }
    );

    test(
        'locked out user sees error message',
        { tag: ['@regression', '@ui'] },
        async ({ loginPage }) => {
            await test.step('login with locked user credentials', async () => {
                await loginPage.login(
                    Users.LOCKED.username,
                    Users.LOCKED.password
                );
            });

            await test.step('verify locked out error message', async () => {
                await expect(loginPage.errorMessage).toContainText(
                    'Sorry, this user has been locked out.'
                );
            });
        }
    );

    test(
        'invalid credentials show error message',
        { tag: ['@regression', '@ui'] },
        async ({ loginPage }) => {
            await test.step('login with invalid credentials', async () => {
                await loginPage.login(
                    Users.INVALID.username,
                    Users.INVALID.password
                );
            });

            await test.step('verify invalid credentials error message', async () => {
                await expect(loginPage.errorMessage).toContainText(
                    'Username and password do not match'
                );
            });
        }
    );
});

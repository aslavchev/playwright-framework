import { Page, Locator } from '@playwright/test';

export class LoginPage {
    constructor(private page: Page) {}

    get usernameInput(): Locator {
        return this.page.getByTestId('username');
    }

    get passwordInput(): Locator {
        return this.page.getByTestId('password');
    }

    get loginButton(): Locator {
        return this.page.getByTestId('login-button');
    }

    get errorMessage(): Locator {
        return this.page.getByTestId('error');
    }

    async navigateToLoginPage(): Promise<void> {
        await this.page.goto('/');
    }

    /**
     * Fills in credentials and submits the login form.
     * @param {string} username - The account username.
     * @param {string} password - The account password.
     */
    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}

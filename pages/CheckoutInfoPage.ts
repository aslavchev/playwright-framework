import { Page, Locator } from '@playwright/test';

export class CheckoutInfoPage {
    constructor(private page: Page) {}

    get firstNameInput(): Locator {
        return this.page.getByTestId('firstName');
    }

    get lastNameInput(): Locator {
        return this.page.getByTestId('lastName');
    }

    get postalCodeInput(): Locator {
        return this.page.getByTestId('postalCode');
    }

    get continueButton(): Locator {
        return this.page.getByTestId('continue');
    }

    get errorMessage(): Locator {
        return this.page.getByTestId('error');
    }

    /**
     * Fills the customer information form.
     * @param {string} firstName - The customer's first name.
     * @param {string} lastName - The customer's last name.
     * @param {string} postalCode - The customer's postal code.
     */
    async fillCustomerInfo(
        firstName: string,
        lastName: string,
        postalCode: string
    ): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
    }

    async continueToOverview(): Promise<void> {
        await this.continueButton.click();
    }
}

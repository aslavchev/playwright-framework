import { Page, Locator } from '@playwright/test';

// No navigateTo method — this page requires prior cart state and cannot be reached directly.
export class CheckoutCompletePage {
    constructor(private page: Page) {}

    get completeHeader(): Locator {
        return this.page.getByTestId('complete-header');
    }

    get completeText(): Locator {
        return this.page.getByTestId('complete-text');
    }

    get backToProductsButton(): Locator {
        return this.page.getByTestId('back-to-products');
    }

    async backToProducts(): Promise<void> {
        await this.backToProductsButton.click();
    }
}

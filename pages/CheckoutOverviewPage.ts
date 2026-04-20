import { Page, Locator } from '@playwright/test';

// No navigateTo method — this page requires prior cart state and cannot be reached directly.
export class CheckoutOverviewPage {
    constructor(private page: Page) {}

    get finishButton(): Locator {
        return this.page.getByTestId('finish');
    }

    get itemTotal(): Locator {
        return this.page.getByTestId('subtotal-label');
    }

    get tax(): Locator {
        return this.page.getByTestId('tax-label');
    }

    get orderTotal(): Locator {
        return this.page.getByTestId('total-label');
    }

    get paymentInfo(): Locator {
        return this.page.getByTestId('payment-info-value');
    }

    get shippingInfo(): Locator {
        return this.page.getByTestId('shipping-info-value');
    }

    get cancelButton(): Locator {
        return this.page.getByTestId('cancel');
    }

    async finishCheckout(): Promise<void> {
        await this.finishButton.click();
    }

    async cancelCheckout(): Promise<void> {
        await this.cancelButton.click();
    }
}

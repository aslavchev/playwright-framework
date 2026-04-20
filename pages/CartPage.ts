import { Page, Locator } from '@playwright/test';

export class CartPage {
    constructor(private page: Page) {}

    get cartItems(): Locator {
        return this.page.getByTestId('inventory-item');
    }

    get checkoutButton(): Locator {
        return this.page.getByTestId('checkout');
    }

    async navigateToCartPage(): Promise<void> {
        await this.page.goto('/cart.html');
    }

    /**
     * Removes an item from the cart by its visible name.
     * @param {string} productName - The exact product name as displayed on the page.
     */
    async removeItem(productName: string): Promise<void> {
        await this.cartItems
            .filter({ hasText: productName })
            .getByRole('button', { name: 'Remove' })
            .click();
    }

    /**
     * Clicks the Checkout button to proceed to checkout.
     */
    async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }
}

import { Page, Locator } from '@playwright/test';

export class ProductsPage {
    constructor(private page: Page) {}

    get cartBadge(): Locator {
        return this.page.getByTestId('shopping-cart-badge');
    }

    get sortDropdown(): Locator {
        return this.page.getByTestId('product-sort-container');
    }

    get productItemNames(): Locator {
        return this.page.getByTestId('inventory-item-name');
    }

    async navigateToProductsPage(): Promise<void> {
        await this.page.goto('/inventory.html');
    }

    /**
     * Adds a product to the cart by its visible name.
     * @param {string} productName - The exact product name as displayed on the page.
     */
    async addToCartOnProductsPage(productName: string): Promise<void> {
        await this.page
            .getByTestId('inventory-item')
            .filter({ hasText: productName })
            .getByRole('button', { name: 'Add to cart' })
            .click();
    }

    /**
     * Removes a product from the cart by its visible name.
     * @param {string} productName - The exact product name as displayed on the page.
     */
    removeItemFromCartButtonOnProductsPage(productName: string): Locator {
        return this.page
            .getByTestId('inventory-item')
            .filter({ hasText: productName })
            .getByRole('button', { name: 'Remove' });
    }

    async removeFromCartOnProductsPage(productName: string): Promise<void> {
        await this.removeItemFromCartButtonOnProductsPage(productName).click();
    }

    /**
     * Selects a sort option by its visible label.
     * @param {string} option - The sort label as shown in the dropdown.
     */
    async sortBy(option: string): Promise<void> {
        await this.sortDropdown.selectOption({ label: option });
    }

    /**
     * Returns a locator for the first product name.
     * Use with expect().toHaveText() for auto-retry after sort actions.
     */
    getFirstProductName(): Locator {
        return this.productItemNames.first();
    }
}

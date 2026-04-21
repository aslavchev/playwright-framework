import { test, expect } from '../../fixtures/pom/test-options';
import { Customers } from '../../test-data/customers';
import { Products } from '../../test-data/products';

test.describe('Checkout E2E', () => {
    test(
        'complete checkout from cart to confirmation',
        { tag: ['@smoke', '@e2e'] },
        async ({
            productsPage,
            cartPage,
            checkoutInfoPage,
            checkoutOverviewPage,
            checkoutCompletePage,
            page,
        }) => {
            await test.step('add backpack to cart', async () => {
                await productsPage.navigateToProductsPage();
                await productsPage.addToCart(Products.BACKPACK);
            });

            await test.step('navigate to cart', async () => {
                await cartPage.navigateToCartPage();
            });

            await test.step('proceed to checkout', async () => {
                await cartPage.proceedToCheckout();
            });

            await test.step('fill customer info', async () => {
                await checkoutInfoPage.fillCustomerInfo(
                    Customers.STANDARD.firstName,
                    Customers.STANDARD.lastName,
                    Customers.STANDARD.postalCode
                );
            });

            await test.step('continue to overview', async () => {
                await checkoutInfoPage.continueToOverview();
            });

            await test.step('verify navigation to overview', async () => {
                await expect(page).toHaveURL(/checkout-step-two/);
            });

            await test.step('verify correct product in overview', async () => {
                await expect(checkoutOverviewPage.cartItemNames).toHaveText([
                    Products.BACKPACK,
                ]);
            });

            await test.step('finish checkout', async () => {
                await checkoutOverviewPage.finishCheckout();
            });

            await test.step('verify order confirmation', async () => {
                await expect(checkoutCompletePage.completeHeader).toContainText(
                    'Thank you for your order!'
                );
            });

            await test.step('back to products', async () => {
                await checkoutCompletePage.backToProducts();
            });

            await test.step('verify navigation to products and cart is cleared', async () => {
                await expect(page).toHaveURL(/inventory/);
                await expect(productsPage.cartBadge).toBeHidden();
            });
        }
    );
});

import { test, expect } from '../../fixtures/pom/test-options';
import { Products } from '../../test-data/products';

test.describe('Cart', () => {
    test.describe('empty cart', () => {
        test.beforeEach(async ({ cartPage }) => {
            await cartPage.navigateToCartPage();
        });

        test(
            'cart is empty by default',
            { tag: ['@smoke', '@ui'] },
            async ({ cartPage, page }) => {
                await test.step('verify cart page is loaded', async () => {
                    await expect(page).toHaveURL(/cart.html/);
                });

                await test.step('verify cart has no items', async () => {
                    await expect(cartPage.cartItems).toHaveCount(0);
                });
            }
        );
    });

    test.describe('cart with items', () => {
        test.beforeEach(async ({ productsPage, cartPage }) => {
            await productsPage.navigateToProductsPage();
            await productsPage.addToCart(Products.BACKPACK);
            await cartPage.navigateToCartPage();
        });

        test(
            'added product appears in cart',
            { tag: ['@smoke', '@ui'] },
            async ({ cartPage }) => {
                await test.step('verify one item is in the cart', async () => {
                    await expect(cartPage.cartItems).toHaveCount(1);
                });
            }
        );

        test(
            'remove item from cart empties the cart',
            { tag: ['@regression', '@ui'] },
            async ({ cartPage }) => {
                await test.step('remove backpack from cart', async () => {
                    await cartPage.removeItem(Products.BACKPACK);
                });

                await test.step('verify cart is empty', async () => {
                    await expect(cartPage.cartItems).toHaveCount(0);
                });
            }
        );

        test(
            'navigate to checkout page',
            { tag: ['@smoke', '@ui'] },
            async ({ cartPage, page }) => {
                await test.step('click proceed to checkout', async () => {
                    await cartPage.proceedToCheckout();
                });

                await test.step('verify user is on checkout page', async () => {
                    await expect(page).toHaveURL(/checkout-step-one/);
                });
            }
        );

        test(
            'continue shopping navigates back to products page',
            { tag: ['@regression', '@ui'] },
            async ({ cartPage, page }) => {
                await test.step('click continue shopping', async () => {
                    await cartPage.continueShopping();
                });

                await test.step('verify navigation back to products page', async () => {
                    await expect(page).toHaveURL(/inventory/);
                });
            }
        );
    });
});

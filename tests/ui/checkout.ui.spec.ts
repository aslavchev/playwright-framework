import { test, expect } from '../../fixtures/pom/test-options';
import { Products } from '../../test-data/products';
import { Customers } from '../../test-data/customers';

test.describe('Checkout Info', () => {
    test.beforeEach(async ({ productsPage, cartPage }) => {
        await productsPage.navigateToProductsPage();
        await productsPage.addToCart(Products.BACKPACK);
        await cartPage.navigateToCartPage();
        await cartPage.proceedToCheckout();
    });

    test(
        'missing first name shows error',
        { tag: ['@regression', '@ui'] },
        async ({ checkoutInfoPage }) => {
            await test.step('submit with missing first name', async () => {
                await checkoutInfoPage.fillCustomerInfo(
                    '',
                    Customers.STANDARD.lastName,
                    Customers.STANDARD.postalCode
                );
                await checkoutInfoPage.continueToOverview();
            });

            await test.step('verify first name error message', async () => {
                await expect(checkoutInfoPage.errorMessage).toContainText(
                    'First Name is required'
                );
            });
        }
    );

    test(
        'missing last name shows error',
        { tag: ['@regression', '@ui'] },
        async ({ checkoutInfoPage }) => {
            await test.step('submit with missing last name', async () => {
                await checkoutInfoPage.fillCustomerInfo(
                    Customers.STANDARD.firstName,
                    '',
                    Customers.STANDARD.postalCode
                );
                await checkoutInfoPage.continueToOverview();
            });

            await test.step('verify last name error message', async () => {
                await expect(checkoutInfoPage.errorMessage).toContainText(
                    'Last Name is required'
                );
            });
        }
    );

    test(
        'missing postal code shows error',
        { tag: ['@regression', '@ui'] },
        async ({ checkoutInfoPage }) => {
            await test.step('submit with missing postal code', async () => {
                await checkoutInfoPage.fillCustomerInfo(
                    Customers.STANDARD.firstName,
                    Customers.STANDARD.lastName,
                    ''
                );
                await checkoutInfoPage.continueToOverview();
            });

            await test.step('verify postal code error message', async () => {
                await expect(checkoutInfoPage.errorMessage).toContainText(
                    'Postal Code is required'
                );
            });
        }
    );
});

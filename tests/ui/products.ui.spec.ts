import { test, expect } from '../../fixtures/pom/test-options';
import { Products, ProductsAtoZ, ProductsZtoA } from '../../test-data/products';
import { SortOptions } from '../../test-data/sortOptions';

test.describe('Products', () => {
    test.beforeEach(async ({ productsPage }) => {
        await productsPage.navigateToProductsPage();
    });

    // Fixed SauceDemo catalogue — update count if Products changes
    test(
        'products page loads with 6 items',
        { tag: ['@smoke', '@ui'] },
        async ({ productsPage }) => {
            await test.step('verify 6 products are displayed', async () => {
                await expect(productsPage.productItemNames).toHaveCount(6);
            });
        }
    );

    test.describe('Sorting', () => {
        test(
            'products are sorted A to Z by default',
            { tag: ['@smoke', '@ui'] },
            async ({ productsPage }) => {
                await test.step('verify products are sorted A to Z', async () => {
                    await expect(productsPage.productItemNames).toHaveText([
                        ...ProductsAtoZ,
                    ]);
                });
            }
        );

        test.describe('Name', () => {
            test(
                'sort by name A to Z reorders products',
                { tag: ['@regression', '@ui'] },
                async ({ productsPage }) => {
                    await test.step('sort products by name A to Z', async () => {
                        await productsPage.sortBy(SortOptions.NAME_ASC);
                    });

                    await test.step('verify products are sorted A to Z', async () => {
                        await expect(productsPage.productItemNames).toHaveText([
                            ...ProductsAtoZ,
                        ]);
                    });
                }
            );

            test(
                'sort by name Z to A reorders products',
                { tag: ['@regression', '@ui'] },
                async ({ productsPage }) => {
                    await test.step('sort products by name Z to A', async () => {
                        await productsPage.sortBy(SortOptions.NAME_DESC);
                    });

                    await test.step('verify products are sorted Z to A', async () => {
                        await expect(productsPage.productItemNames).toHaveText([
                            ...ProductsZtoA,
                        ]);
                    });
                }
            );
        });

        test.describe('Price', () => {
            test(
                'sort by price low to high reorders products',
                { tag: ['@regression', '@ui'] },
                async ({ productsPage }) => {
                    await test.step('sort products by price low to high', async () => {
                        await productsPage.sortBy(SortOptions.PRICE_ASC);
                    });

                    // boundary-only: $15.99 tie between BOLT_TSHIRT and TSHIRT_RED makes full-array assertion non-deterministic
                    await test.step('verify cheapest and most expensive products', async () => {
                        await expect(
                            productsPage.productItemNames.first()
                        ).toHaveText(Products.ONESIE);
                        await expect(
                            productsPage.productItemNames.last()
                        ).toHaveText(Products.FLEECE_JACKET);
                    });
                }
            );

            test(
                'sort by price high to low reorders products',
                { tag: ['@regression', '@ui'] },
                async ({ productsPage }) => {
                    await test.step('sort products by price high to low', async () => {
                        await productsPage.sortBy(SortOptions.PRICE_DESC);
                    });

                    // boundary-only: $15.99 tie between BOLT_TSHIRT and TSHIRT_RED makes full-array assertion non-deterministic
                    await test.step('verify most expensive and cheapest products', async () => {
                        await expect(
                            productsPage.productItemNames.first()
                        ).toHaveText(Products.FLEECE_JACKET);
                        await expect(
                            productsPage.productItemNames.last()
                        ).toHaveText(Products.ONESIE);
                    });
                }
            );
        });
    });

    test(
        'add product to cart increments badge to 1',
        { tag: ['@regression', '@ui'] },
        async ({ productsPage }) => {
            await test.step('add product to cart', async () => {
                await productsPage.addToCart(Products.BACKPACK);
            });

            await test.step('verify the badge displays 1', async () => {
                await expect(productsPage.cartBadge).toHaveText('1');
            });
        }
    );

    test(
        'remove only product from cart clears the badge',
        { tag: ['@regression', '@ui'] },
        async ({ productsPage }) => {
            await test.step('add product to cart', async () => {
                await productsPage.addToCart(Products.BACKPACK);
            });

            await test.step('remove product from cart', async () => {
                await productsPage.removeItemFromCart(Products.BACKPACK);
            });

            await test.step('verify cart badge is hidden', async () => {
                await expect(productsPage.cartBadge).toBeHidden();
            });
        }
    );

    // removeItemFromCart filters by product name — correct item scoping is enforced at page object level
    test(
        'remove one of multiple products decrements badge',
        { tag: ['@regression', '@ui'] },
        async ({ productsPage }) => {
            await test.step('add two products to cart', async () => {
                await productsPage.addToCart(Products.BACKPACK);
                await productsPage.addToCart(Products.BIKE_LIGHT);
            });

            await test.step('remove one product', async () => {
                await productsPage.removeItemFromCart(Products.BACKPACK);
            });

            await test.step('verify badge decrements to 1', async () => {
                await expect(productsPage.cartBadge).toHaveText('1');
            });

            await test.step('verify bike light remains in cart', async () => {
                await expect(
                    productsPage.removeItemFromCartButton(Products.BIKE_LIGHT)
                ).toBeVisible();
            });
        }
    );
});

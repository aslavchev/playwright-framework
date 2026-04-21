export const Products = {
    BACKPACK: 'Sauce Labs Backpack',
    BIKE_LIGHT: 'Sauce Labs Bike Light',
    BOLT_TSHIRT: 'Sauce Labs Bolt T-Shirt',
    FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
    ONESIE: 'Sauce Labs Onesie',
    TSHIRT_RED: 'Test.allTheThings() T-Shirt (Red)',
} as const;

// Fixed SauceDemo catalogue — update both arrays if Products changes
export const ProductsAtoZ = [
    Products.BACKPACK,
    Products.BIKE_LIGHT,
    Products.BOLT_TSHIRT,
    Products.FLEECE_JACKET,
    Products.ONESIE,
    Products.TSHIRT_RED,
] as const;

export const ProductsZtoA = [
    Products.TSHIRT_RED,
    Products.ONESIE,
    Products.FLEECE_JACKET,
    Products.BOLT_TSHIRT,
    Products.BIKE_LIGHT,
    Products.BACKPACK,
] as const;

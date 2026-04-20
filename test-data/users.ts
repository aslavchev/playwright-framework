export const Users = {
    STANDARD: {
        username: process.env.SAUCE_USERNAME!,
        password: process.env.SAUCE_PASSWORD!,
    },
    // Fixed SauceDemo test accounts — credentials do not vary by environment
    LOCKED: {
        username: 'locked_out_user',
        password: 'secret_sauce',
    },
    INVALID: {
        username: 'invalid_user',
        password: 'wrong_password',
    },
} as const;

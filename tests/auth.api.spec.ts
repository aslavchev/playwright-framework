import { test } from '../fixtures/api/api-request-fixture';
import { expect } from '@playwright/test';
import { UserSchema } from '../fixtures/api/schemas';

test.describe('Auth API', () => {
    test('valid token returns authenticated user', { tag: '@smoke' }, async ({ apiRequest }) => {
        const { status, body } = await apiRequest({ method: 'GET', url: '/user' });
        expect(status).toBe(200);

        const user = UserSchema.parse(body);
        expect(user.login).toBe(process.env.USER_NAME);
    });

    test('Empty token returns 401', { tag: '@smoke' }, async ({ apiRequest }) => {
        const { status } = await apiRequest({ method: 'GET', url: '/user', headers: { Authorization: '' } });
        expect(status).toBe(401);
    });

    test('Invalid token returns 401', { tag: '@smoke' }, async ({ apiRequest }) => {
        const { status } = await apiRequest({ method: 'GET', url: '/user', headers: { Authorization: `Bearer ${process.env.INVALID_TOKEN}` } });
        expect(status).toBe(401);
    });
});

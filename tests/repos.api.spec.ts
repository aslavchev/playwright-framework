import { test } from '../fixtures/api/api-request-fixture';
import { expect } from '@playwright/test';
import { RepoSchema } from '../fixtures/api/schemas';

test.describe('Repos API', () => {
    test(
        'Valid owner + valid repo return the repo name',
        { tag: '@smoke' },
        async ({ apiRequest }) => {
            const { status, body } = await apiRequest({
                method: 'GET',
                url: `/repos/${process.env.USER_NAME}/${process.env.REPO_NAME}`,
            });

            expect(status).toBe(200);
            const repo = RepoSchema.parse(body);
            expect(repo.name).toBe(process.env.REPO_NAME);
        }
    );

    test(
        'Get Non-existent repo return 404',
        { tag: '@smoke' },
        async ({ apiRequest }) => {
            const { status } = await apiRequest({
                method: 'GET',
                url: `/repos/${process.env.USER_NAME}/nonexistent-repo-12345`,
            });
            expect(status).toBe(404);
        }
    );

    test(
        'List user repos returns array of repos',
        { tag: '@smoke' },
        async ({ apiRequest }) => {
            const { status, body } = await apiRequest({
                method: 'GET',
                url: '/user/repos',
            });
            expect(status).toBe(200);
            expect(Array.isArray(body)).toBe(true);
        }
    );
});

import { test } from '../../fixtures/api/api-request-fixture';
import { expect } from '@playwright/test';
import { LabelSchema } from '../../fixtures/api/schemas';

test.describe('Labels API', () => {
    const repoPath = `/repos/${process.env.USER_NAME}/${process.env.REPO_NAME}/labels`;
    const uniqueLabel = `test-label-${Date.now()}`;
    let labelName: string;

    test.afterAll(async ({ request }) => {
        if (labelName) {
            await request.delete(
                `${process.env.API_URL}${repoPath}/${labelName}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.TOKEN}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                }
            );
        }
    });

    test(
        'CRUD label lifecycle',
        { tag: '@regression' },
        async ({ apiRequest }) => {
            await test.step('Create label returns 201 with name', async () => {
                const { status, body } = await apiRequest({
                    method: 'POST',
                    url: repoPath,
                    body: { name: uniqueLabel, color: 'ff0000' },
                });
                expect(status).toBe(201);
                const label = LabelSchema.parse(body);
                expect(label.name).toBe(uniqueLabel);
                expect(label.color).toBe('ff0000');
                labelName = label.name;
            });

            await test.step('List labels returns array', async () => {
                const { status, body } = await apiRequest({
                    method: 'GET',
                    url: repoPath,
                });
                expect(status).toBe(200);
                expect(Array.isArray(body)).toBe(true);
            });

            await test.step('Update label returns updated name', async () => {
                const { status, body } = await apiRequest({
                    method: 'PATCH',
                    url: `${repoPath}/${labelName}`,
                    body: { name: `updated-${uniqueLabel}`, color: '00ff00' },
                });
                expect(status).toBe(200);
                const label = LabelSchema.parse(body);
                expect(label.name).toBe(`updated-${uniqueLabel}`);
                expect(label.color).toBe('00ff00');
                labelName = label.name;
            });

            await test.step('Delete label returns 204', async () => {
                const { status } = await apiRequest({
                    method: 'DELETE',
                    url: `${repoPath}/${labelName}`,
                });
                expect(status).toBe(204);
                labelName = '';
            });
        }
    );

    test(
        'Create duplicate label returns 422',
        { tag: '@regression' },
        async ({ apiRequest }) => {
            const { status } = await apiRequest({
                method: 'POST',
                url: repoPath,
                body: { name: 'bug', color: 'ff0000' }, // 'bug' is a default GitHub label
            });
            expect(status).toBe(422);
        }
    );

    test(
        'Delete non-existent label returns 404',
        { tag: '@regression' },
        async ({ apiRequest }) => {
            const { status } = await apiRequest({
                method: 'DELETE',
                url: `${repoPath}/nonexistent-label-12345`,
            });
            expect(status).toBe(404);
        }
    );
});

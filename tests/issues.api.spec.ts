import { test } from '../fixtures/api/api-request-fixture';
import { expect } from '@playwright/test';
import { IssueSchema } from '../fixtures/api/schemas';

test.describe('Issues API', () => {
    const repoPath = `/repos/${process.env.USER_NAME}/${process.env.REPO_NAME}/issues`;
    let issueNumber: number;

    test.afterAll(async ({ request }) => {
        if (issueNumber) {
            await request.patch(
                `${process.env.API_URL}${repoPath}/${issueNumber}`,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.TOKEN}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                    data: { state: 'closed' },
                }
            );
        }
    });

    test('CRUD issue lifecycle', { tag: '@smoke' }, async ({ apiRequest }) => {
        await test.step('Create issue returns 201 with title', async () => {
            const { status, body } = await apiRequest({
                method: 'POST',
                url: repoPath,
                body: { title: 'Test issue from Playwright' },
            });
            expect(status).toBe(201);
            const issue = IssueSchema.parse(body);
            expect(issue.title).toBe('Test issue from Playwright');
            expect(issue.state).toBe('open');
            issueNumber = issue.number;
        });

        await test.step('Get issue by number returns the created issue', async () => {
            const { status, body } = await apiRequest({
                method: 'GET',
                url: `${repoPath}/${issueNumber}`,
            });
            expect(status).toBe(200);
            const issue = IssueSchema.parse(body);
            expect(issue.number).toBe(issueNumber);
            expect(issue.title).toBe('Test issue from Playwright');
        });

        await test.step('Update issue title returns 200', async () => {
            const { status, body } = await apiRequest({
                method: 'PATCH',
                url: `${repoPath}/${issueNumber}`,
                body: { title: 'Updated Test issue from Playwright' },
            });
            expect(status).toBe(200);
            const issue = IssueSchema.parse(body);
            expect(issue.number).toBe(issueNumber);
            expect(issue.title).toBe('Updated Test issue from Playwright');
        });

        await test.step('Close issue returns closed state', async () => {
            const { status, body } = await apiRequest({
                method: 'PATCH',
                url: `${repoPath}/${issueNumber}`,
                body: { state: 'closed' },
            });
            expect(status).toBe(200);
            const issue = IssueSchema.parse(body);
            expect(issue.number).toBe(issueNumber);
            expect(issue.title).toBe('Updated Test issue from Playwright');
            expect(issue.state).toBe('closed');
        });
    });

    test(
        'Create issue without title returns 422',
        { tag: '@smoke' },
        async ({ apiRequest }) => {
            const { status } = await apiRequest({
                method: 'POST',
                url: repoPath,
                body: {},
            });
            expect(status).toBe(422);
        }
    );

    test(
        'Get non-existent issue returns 404',
        { tag: '@smoke' },
        async ({ apiRequest }) => {
            const { status } = await apiRequest({
                method: 'GET',
                url: `${repoPath}/9999`,
            });
            expect(status).toBe(404);
        }
    );
});

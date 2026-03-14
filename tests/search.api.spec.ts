import {test} from '../fixtures/api/api-request-fixture';
import {expect} from '@playwright/test';
import { SearchResultSchema } from '../fixtures/api/schemas';


test.describe('Search API', () => {
    test('Search repos by keyword returns results',{tag:'@regression'}, async ({ apiRequest }) => {
        const { status, body } = await apiRequest({
            method:'GET',
            url: '/search/repositories?q=playwright-framework', 
         });
        expect(status).toBe(200);

        const result = SearchResultSchema.parse(body);
        expect(result.total_count).toBeGreaterThan(0);
        expect(result.items.length).toBeGreaterThan(0);
    });

    test('Search for non-existent repo returns zero results',{tag:'@regression'}, async ({ apiRequest }) => {
        const { status, body } = await apiRequest({
            method:'GET',
            url: '/search/repositories?q=xyznonexistent123',
        }); 
        expect(status).toBe(200);

        const result = SearchResultSchema.parse(body);
        expect(result.total_count).toBe(0);
        expect(result.items.length).toBe(0);
    });
});
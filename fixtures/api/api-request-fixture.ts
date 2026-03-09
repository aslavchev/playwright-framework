import { test as base } from '@playwright/test';
import { apiRequest as apiRequestOriginal } from './plain-function';
import type {
    ApiRequestFn,
    ApiRequestMethods,
    ApiRequestParams,
    ApiRequestResponse,
} from './types-guards';

/**
 * Extends the base Playwright test fixture with a reusable apiRequest function.
 * Injects the Playwright request context so tests only need to provide method, url, body, and headers.
 */
export const test = base.extend<ApiRequestMethods>({
    apiRequest: async ({ request }, use) => {
        const apiRequestFn: ApiRequestFn = async <T = unknown>({
            method,
            url,
            baseUrl,
            body = null,
            headers,
        }: ApiRequestParams): Promise<ApiRequestResponse<T>> => {
            const response = await apiRequestOriginal({
                request,
                method,
                url,
                baseUrl,
                body,
                headers,
            });

            return {
                status: response.status,
                body: response.body as T,
            };
        };

        await use(apiRequestFn);
    },
});

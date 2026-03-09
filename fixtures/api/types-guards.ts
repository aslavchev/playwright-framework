import { z } from 'zod';
import type {
    UserSchema,
    RepoSchema,
    IssueSchema,
    LabelSchema,
    SearchResultSchema,
    ErrorSchema,
} from './schemas';

/** Parameters for making an API request. */
export type ApiRequestParams = {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    baseUrl?: string;
    body?: Record<string, unknown> | null;
    headers?: Record<string, string>;
};

/** Response from an API request containing status code and typed body. */
export type ApiRequestResponse<T = unknown> = {
    status: number;
    body: T;
};

/** Function signature for making typed API requests. */
export type ApiRequestFn = <T = unknown>(
    params: ApiRequestParams
) => Promise<ApiRequestResponse<T>>;

/** Fixture type grouping the apiRequest function for Playwright's extend. */
export type ApiRequestMethods = {
    apiRequest: ApiRequestFn;
};

export type User = z.infer<typeof UserSchema>;
export type Repo = z.infer<typeof RepoSchema>;
export type Issue = z.infer<typeof IssueSchema>;
export type Label = z.infer<typeof LabelSchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type ErrorResponse = z.infer<typeof ErrorSchema>;

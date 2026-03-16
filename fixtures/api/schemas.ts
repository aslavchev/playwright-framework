import { z } from 'zod';

/** Schema for the authenticated GitHub user response (GET /user). */
export const UserSchema = z.object({
    login: z.string(),
    id: z.number(),
    avatar_url: z.string(),
    html_url: z.string(),
    type: z.string(),
    name: z.string().nullable(),
    bio: z.string().nullable(),
    public_repos: z.number(),
    followers: z.number(),
    following: z.number(),
});

/** Schema for a GitHub repository response (GET /repos/{owner}/{repo}). */
export const RepoSchema = z.object({
    id: z.number(),
    name: z.string(),
    full_name: z.string(),
    private: z.boolean(),
    html_url: z.string(),
    description: z.string().nullable(),
    fork: z.boolean(),
    owner: z.object({
        login: z.string(),
        id: z.number(),
    }),
});

/** Schema for a GitHub issue response (GET/POST /repos/{owner}/{repo}/issues). */
export const IssueSchema = z.object({
    id: z.number(),
    number: z.number(),
    title: z.string(),
    state: z.string(),
    body: z.string().nullable(),
    user: z.object({
        login: z.string(),
        id: z.number(),
    }),
    labels: z.array(
        z.object({
            name: z.string(),
            color: z.string(),
        })
    ),
});

/** Schema for a GitHub label response (GET/POST /repos/{owner}/{repo}/labels). */
export const LabelSchema = z.object({
    id: z.number(),
    name: z.string(),
    color: z.string(),
    description: z.string().nullable(),
    default: z.boolean(),
});

/** Schema for the GitHub search repositories response (GET /search/repositories). */
export const SearchResultSchema = z.object({
    total_count: z.number(),
    incomplete_results: z.boolean(),
    items: z.array(RepoSchema),
});

/** Schema for GitHub API error responses (404, 422, etc.). */
export const ErrorSchema = z.object({
    message: z.string(),
    documentation_url: z.string(),
});

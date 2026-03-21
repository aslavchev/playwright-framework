# ADR-001: Playwright + TypeScript for GitHub API Testing

**Status:** Accepted | **Date:** 2026-03-09

---

## Context and Problem Statement

Need an automated API test framework for GitHub's REST API. The framework must handle token-based authentication, JSON response validation, and CRUD test coverage across multiple endpoint groups (users, repos, issues, labels, search). It should support CI execution with public reporting and be extensible to UI testing if a suitable target is added later.

---

## Decision Drivers

- No additional HTTP libraries — framework must handle API calls natively
- Compile-time safety — catch contract violations before tests run, not during
- Extensible to UI testing without migrating to a second tool
- Industry relevance — Playwright appears in job descriptions more frequently than REST Assured for modern QA roles

---

## Decision

Use Playwright with TypeScript for API testing against GitHub's REST API.

---

## Considered Options

| Option | Pros | Cons | Verdict |
| ------ | ---- | ---- | ------- |
| **Playwright + TypeScript** | Built-in API client, fixtures for DI, type safety, modern async/await | Async patterns require learning, less common in enterprise Java environments | ✅ Chosen |
| **REST Assured + Java** | Familiar from a prior project, strong API validation DSL | Java-only, no built-in UI testing path, already have a project with it | ❌ Already demonstrated |

---

## Key Decision Factors

**Built-in API support without extra dependencies.** Playwright provides `APIRequestContext` out of the box. No need for Axios, node-fetch, or supertest. The same framework handles both API and UI testing, so adding UI tests later requires zero additional tooling.

**Fixtures as dependency injection.** Playwright's fixture system injects the API request context into every test automatically. Tests declare what they need (`async ({ apiRequest }) =>`), and the framework provides it. This eliminates manual setup in every test file and mirrors how modern backend frameworks handle DI.

**TypeScript + Zod for two layers of validation.** TypeScript catches structural errors at compile time (wrong property name, missing field). Zod validates the actual API response shape at runtime (field exists, correct type, not null when expected). Without TypeScript, Zod still works but you lose IDE autocomplete and compile-time checks.

---

## Consequences

**Positive:**
- Zod schemas serve as living API contract documentation
- Fixtures eliminate boilerplate setup in every test file
- Same framework supports future UI test expansion without migration
- Built-in HTML reporting with GitHub Pages deployment

**Trade-offs:**
- TypeScript's async/await and type system require learning investment (mitigated by structured article series as a guide)
- Playwright is less common in enterprise Java environments (acceptable for an API-focused framework)

---

## Confirmation

- All API tests import `test` from the custom fixture (`api-request-fixture.ts`), not from `@playwright/test` directly. `expect` is still imported from Playwright.
- Every test suite validates response shape with a Zod schema before asserting values
- `tsconfig.json` has `strict: true` enabled
- No `any` types in the codebase (enforced by ESLint rule `@typescript-eslint/no-explicit-any`)

---

**References:** [Playwright API Testing Docs](https://playwright.dev/docs/api-testing) | [Zod Documentation](https://zod.dev/) | [Ivan Davidov's Playwright Series](https://idavidov.eu/roadmap)

**Last Updated:** 2026-03-21

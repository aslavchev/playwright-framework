# Framework Approach

This framework was built by following [Ivan Davidov's 10-article Playwright series](https://idavidov.eu/roadmap), adapting his Conduit demo app approach to target GitHub's REST API.

## Why follow a structured series?

Building a framework from scratch without a proven reference leads to ad-hoc decisions. Ivan's series provides a battle-tested architecture: fixtures for dependency injection, Zod for schema validation, composite actions for CI, and a clear separation between request logic and test logic. Following it ensured every architectural choice has documented rationale behind it.

## What was followed as-is

| Article | Topic | Applied |
|---------|-------|---------|
| 1 | Initial Playwright setup | Yes — same scaffolding |
| 2 | User snippets (VS Code) | Yes — IDE config |
| 3 | Environment variables with dotenv | Yes — multi-environment support |
| 4 | Design pattern (POM with getters + methods) | Yes — 6 page objects with getter pattern |
| 5 | POM as fixture + auth user session | Yes — POM fixtures via `test.extend()`, storageState for session reuse, inline reset for login tests |
| 6 | UI tests | Yes — 4 UI specs + 1 E2E spec targeting SauceDemo |
| 7 | API fixtures (plain-function, schemas, types-guards, fixture) | Yes — same 4-file architecture |
| 8 | API tests | Yes — 5 suites covering auth, repos, search, issues, labels |
| 9 | CI/CD with GitHub Actions | Yes — same composite actions, blob reports, GitHub Pages |
| 10 | ESLint + Prettier + Husky | Yes — same toolchain |

## What was customized

**Dual target — GitHub API and SauceDemo UI.** Ivan's series targets a Conduit demo app. This framework covers two targets: GitHub's REST API (Articles 7–8) and SauceDemo's UI (Articles 4–6). The API layer uses Playwright's `APIRequestContext` with Zod schema validation. The UI layer uses page objects with the getter pattern, POM fixtures, and storageState for session management.

**Lint gate before tests.** Ivan's pipeline runs smoke tests first. This pipeline adds an ESLint check as the first job — if code doesn't pass lint, tests don't run. Cheaper feedback before expensive test execution.

**Always upload blob reports.** Ivan's pipeline uploads reports only on failure. This pipeline always uploads them because the merge and deploy jobs need blobs from every run to produce the live GitHub Pages report.

**Docker for local execution.** Not covered in Ivan's series. Added a Dockerfile so tests can run in a consistent environment locally without installing Node or Playwright dependencies on the host machine.

**6 Zod schemas instead of 3.** Ivan validates User, Error, and Article responses. This framework validates User, Repo, Issue, Label, SearchResult, and Error — matching the GitHub API endpoint groups under test (users, repos, issues, labels, search).

**Token auth instead of login flow.** Ivan's auth setup calls POST /api/users/login to get a token at runtime, then saves a browser session via storageState. This framework uses a pre-generated GitHub Personal Access Token from the .env file. No login call, no browser session needed.

## UI layer decisions

### SauceDemo as UI target

Ivan's series targets Conduit, a live demo app that requires account registration and can be unstable. SauceDemo was chosen instead — it is purpose-built for framework demonstrations, has a fixed set of users and products, requires no account creation, and is the industry-standard target for Playwright and Selenium portfolio projects. The predictable data makes assertions deterministic without any seeding or teardown.

### `as const` over TypeScript enums

Test data is defined as plain objects with `as const` rather than TypeScript enums:

```typescript
export const Products = {
    BACKPACK: 'Sauce Labs Backpack',
} as const;
```

TypeScript enums add hidden complexity — they compile to extra JavaScript at runtime and allow reverse lookups that are rarely intentional. `as const` is simpler: it tells TypeScript to treat the values as fixed literals and produces no extra compiled output. The type safety is the same, with less surprise.

### Inline storageState reset for login tests

Login tests must run without the saved auth session. Rather than maintaining a separate `guestSession.json` file containing `{}`, the describe block resets auth state inline:

```typescript
test.use({ storageState: { cookies: [], origins: [] } });
```

This is self-documenting — the intent is visible at the point of use — and removes a file that serves no purpose beyond holding an empty object.

### `type` over `interface` for fixture shapes

`FrameworkFixtures` is declared with `type`, not `interface`:

```typescript
export type FrameworkFixtures = {
    loginPage: LoginPage;
    // ...
};
```

`interface` supports declaration merging — a second `interface FrameworkFixtures` block anywhere in the project would silently extend the first. For fixture definitions, that is never the desired behaviour. `type` is closed by design: the shape is exactly what is declared, nothing more.

---

## Articles referenced

1. [Initial Setup](https://idavidov.eu/building-playwright-framework-step-by-step-initial-setup) — Setting the foundation for a professional framework
2. [Create User Snippets](https://idavidov.eu/building-playwright-framework-step-by-step-create-user-snippets) — Boosting productivity with snippets in IDEs
3. [Setup Environment Variables](https://idavidov.eu/building-playwright-framework-step-by-step-setup-environment-variables) — Managing sensitive data and configurations securely
4. [Setup Design Pattern](https://idavidov.eu/building-playwright-framework-step-by-step-setup-design-pattern) — Structuring your project for maintainability
5. [Implementing POM as Fixture and Auth User Session](https://idavidov.eu/building-playwright-framework-step-by-step-implementing-pom-as-fixture-and-auth-user-session) — Advanced Page Object Model usage and handling state
6. [Implementing UI Tests](https://idavidov.eu/building-playwright-framework-step-by-step-implementing-ui-tests) — Writing robust end-to-end UI scenarios
7. [Implementing API Fixtures](https://idavidov.eu/building-playwright-framework-step-by-step-implementing-api-fixtures) — Setting up reusable API components
8. [Implementing API Tests](https://idavidov.eu/building-playwright-framework-step-by-step-implementing-api-tests) — Validating backend logic directly
9. [Implementing CI/CD](https://idavidov.eu/building-playwright-framework-step-by-step-implementing-cicd) — Automating execution with continuous integration pipelines
10. [ESLint and Husky in Playwright](https://idavidov.eu/never-commit-broken-code-again-a-guide-to-eslint-and-husky-in-playwright) — Enforcing code quality automatically

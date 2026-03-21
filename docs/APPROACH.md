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
| 4 | Design pattern (POM with getters + methods) | Partially — no UI pages, but same fixture pattern |
| 5 | POM as fixture + auth user session | Partially — fixtures yes, storageState not needed (API-only) |
| 6 | UI tests | No — API-only, no UI target |
| 7 | API fixtures (plain-function, schemas, types-guards, fixture) | Yes — same 4-file architecture |
| 8 | API tests | Yes — 5 suites covering auth, repos, search, issues, labels |
| 9 | CI/CD with GitHub Actions | Yes — same composite actions, blob reports, GitHub Pages |
| 10 | ESLint + Prettier + Husky | Yes — same toolchain |

## What was customized

**API-only, no UI tests.** Ivan's series targets a Conduit demo app with both UI and API. This framework targets GitHub's REST API exclusively. No page objects, no storageState, no browser install in CI.

**Lint gate before tests.** Ivan's pipeline runs smoke tests first. This pipeline adds an ESLint check as the first job — if code doesn't pass lint, tests don't run. Cheaper feedback before expensive test execution.

**Always upload blob reports.** Ivan's pipeline uploads reports only on failure. This pipeline always uploads them because the merge and deploy jobs need blobs from every run to produce the live GitHub Pages report.

**Docker for local execution.** Not covered in Ivan's series. Added a Dockerfile so tests can run in a consistent environment locally without installing Node or Playwright dependencies on the host machine.

**6 Zod schemas instead of 3.** Ivan validates User, Error, and Article responses. This framework validates User, Repo, Issue, Label, SearchResult, and Error — matching the GitHub API endpoint groups under test (users, repos, issues, labels, search).

**Token auth instead of login flow.** Ivan's auth setup calls POST /api/users/login to get a token at runtime, then saves a browser session via storageState. This framework uses a pre-generated GitHub Personal Access Token from the .env file. No login call, no browser session needed.

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

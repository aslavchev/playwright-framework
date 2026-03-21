# playwright-framework

[![Playwright CI](https://github.com/aslavchev/playwright-framework/actions/workflows/playwright-ci.yml/badge.svg)](https://github.com/aslavchev/playwright-framework/actions/workflows/playwright-ci.yml)
[![HTML Report](https://img.shields.io/badge/report-github--pages-blue)](https://aslavchev.github.io/playwright-framework/)

Playwright + TypeScript API test framework for the GitHub REST API.

| Suite | Tests | Tag | Coverage |
| --- | --- | --- | --- |
| Auth | 3 | @smoke | Valid token, empty token, invalid token |
| Repos | 3 | @smoke | Get repo, non-existent repo, list user repos |
| Issues | 3 | @smoke | CRUD lifecycle, no title, non-existent issue |
| Search | 2 | @regression | Keyword search, zero results |
| Labels | 3 | @regression | CRUD lifecycle, duplicate label, non-existent label |

## Run locally

```bash
npm ci
npx playwright install chromium
cp env/.env.example env/.env.dev   # add your GitHub PAT
npx playwright test                # all tests
npx playwright test --grep @smoke  # smoke only
npx playwright test --grep @regression  # regression only
npx playwright show-report         # open HTML report
```

## Setup

Create `env/.env.dev` with:

```bash
API_URL=https://api.github.com
USER_NAME=<your-github-username>
TOKEN=<your-github-pat>
INVALID_TOKEN=invalidToken_asdaqw123
REPO_NAME=playwright-framework
```

The token needs `repo` scope for issue and label CRUD tests.

## CI Pipeline

```text
lint → smoke-test → regression-test → merge-report → build-report → deploy-report
```

Lint gates everything. Smoke runs first, regression follows after smoke passes. Both produce blob reports that get merged into a single HTML report and deployed to GitHub Pages.

## Structure

```text
fixtures/
  api/
    api-request-fixture.ts   # test.extend() — injects apiRequest
    plain-function.ts        # Generic HTTP helper with method dispatch
    schemas.ts               # Zod schemas for response validation
    types-guards.ts          # TypeScript types derived from Zod schemas
tests/
  auth.api.spec.ts           # GET /user — token validation
  repos.api.spec.ts          # GET /repos — repo lookup
  issues.api.spec.ts         # CRUD /repos/{owner}/{repo}/issues
  labels.api.spec.ts         # CRUD /repos/{owner}/{repo}/labels
  search.api.spec.ts         # GET /search/repositories
docs/
  adr/ADR-001-playwright-typescript.md  # Why Playwright + TypeScript
  APPROACH.md                           # How the framework was built (credits Ivan Davidov)
.github/
  workflows/playwright-ci.yml
  actions/
    playwright-setup/        # Composite: Node, deps, browser caching
    playwright-report/       # Composite: blob report upload
```

## Docker

```bash
cp env/.env.example env/.env.dev   # add your GitHub PAT
docker compose up --build          # build and run all tests
```

Reports are mapped to your host via volumes — open `playwright-report/index.html` after the run.

## Linting

ESLint + Prettier enforced via Husky pre-commit hook. Key rules:

- `no-console` (inline exceptions only)
- `explicit-function-return-type`
- `no-floating-promises`
- `playwright/missing-playwright-await`
- `playwright/no-skipped-test`
- `playwright/no-page-pause`

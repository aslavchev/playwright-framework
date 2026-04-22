# playwright-framework

[![Playwright CI](https://github.com/aslavchev/playwright-framework/actions/workflows/playwright-ci.yml/badge.svg)](https://github.com/aslavchev/playwright-framework/actions/workflows/playwright-ci.yml)
[![HTML Report](https://img.shields.io/badge/report-github--pages-blue)](https://aslavchev.github.io/playwright-framework/)

Playwright + TypeScript framework covering API testing against the GitHub REST API and UI testing against SauceDemo.

## API Tests — GitHub REST API

| Suite | Tests | Tag | Coverage |
| --- | --- | --- | --- |
| Auth | 3 | @smoke | Valid token, empty token, invalid token |
| Repos | 3 | @smoke | Get repo, non-existent repo, list user repos |
| Issues | 3 | @smoke | CRUD lifecycle, no title, non-existent issue |
| Search | 2 | @regression | Keyword search, zero results |
| Labels | 3 | @regression | CRUD lifecycle, duplicate label, non-existent label |

## UI Tests — SauceDemo

| Suite | Tests | Tag | Coverage |
| --- | --- | --- | --- |
| Login | 3 | @smoke / @regression | Successful login, locked user, invalid credentials |
| Products | 9 | @smoke / @regression | Add to cart, remove, sort by price and name |
| Cart | 5 | @smoke / @regression | Empty cart, add item, remove item, checkout, continue shopping |
| Checkout | 3 | @regression | Missing first name, last name, postal code |
| Checkout E2E | 1 | @smoke / @e2e | Full flow: add to cart → checkout → order confirmation |

## Run locally

```bash
npm ci
npx playwright install chromium
cp env/.env.example env/.env.dev   # add credentials
npx playwright test                        # all tests
npx playwright test --project=api          # API only
npx playwright test --project=chromium --project=e2e  # UI only
npx playwright test --grep @smoke          # smoke only
npx playwright test --grep @regression     # regression only
npx playwright show-report                 # open HTML report
```

## Setup

Create `env/.env.dev` with:

```bash
API_URL=https://api.github.com
USER_NAME=<your-github-username>
TOKEN=<your-github-pat>
INVALID_TOKEN=invalidToken_asdaqw123
REPO_NAME=playwright-framework
UI_URL=https://www.saucedemo.com
SAUCE_USERNAME=<saucedemo-username>
SAUCE_PASSWORD=<saucedemo-password>
```

The GitHub token needs `repo` scope for issue and label CRUD tests.

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
  pom/
    page-object-fixture.ts   # test.extend() — injects page objects
    test-options.ts          # mergeTests() — single import for all tests
pages/                       # Page objects — getter pattern, one class per page
  LoginPage.ts
  ProductsPage.ts
  CartPage.ts
  CheckoutInfoPage.ts
  CheckoutOverviewPage.ts
  CheckoutCompletePage.ts
test-data/
  users.ts                   # SauceDemo user credentials
  customers.ts               # Checkout form data
  products.ts                # Product name constants
tests/
  api/
    auth.api.spec.ts         # GET /user — token validation
    repos.api.spec.ts        # GET /repos — repo lookup
    issues.api.spec.ts       # CRUD /repos/{owner}/{repo}/issues
    labels.api.spec.ts       # CRUD /repos/{owner}/{repo}/labels
    search.api.spec.ts       # GET /search/repositories
  ui/
    login.ui.spec.ts         # Login page validation
    products.ui.spec.ts      # Products page interactions
    cart.ui.spec.ts          # Cart page interactions
    checkout.ui.spec.ts      # Checkout info validation
    checkout.e2e.spec.ts     # Full checkout flow
    auth.ui.setup.ts         # Saves authenticated session via storageState
docs/
  adr/ADR-001-playwright-typescript.md  # Why Playwright + TypeScript
  APPROACH.md                           # How the framework was built + UI decisions
.github/
  workflows/playwright-ci.yml
  actions/
    playwright-setup/        # Composite: Node, deps, browser caching
    playwright-report/       # Composite: blob report upload
```

## Docker

```bash
cp env/.env.example env/.env.dev   # add credentials
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

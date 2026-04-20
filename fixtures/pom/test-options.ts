import { test as base, mergeTests } from '@playwright/test';
import { test as pageObjectFixture } from './page-object-fixture';

// Single fixture merged now. mergeTests is retained as the entry point pattern
// so additional fixture sets can be added here without changing test file imports.
const test = mergeTests(pageObjectFixture);

const expect = base.expect;
export { test, expect };

import { mergeTests } from 'playwright/test';

import { test as fixturesApi } from './fixturesApi';
import { test as fixturesUI } from './fixturesUI';

export const test = mergeTests(fixturesApi, fixturesUI);
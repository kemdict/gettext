The POT is extracted from index.test.ts via `npm run extract`, then the PO files are translated from there, then the MO files are compiled via `npm run compile-mo`. `compile-mo` has to be done before running tests.

Because the tested code is a loader itself, Vitest doesn't seem to generate coverage for it. The tests themselves are still useful, though.

Run the tests by going to the parent directory then running `npx vitest`.

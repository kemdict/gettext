# @kemdict/gettext Changelog

## v0.0.1 (unreleased)

- First forked version

The plan is to move away from Grunt, move to node:test and node:assert, do the rename, etc.

### Changes

- Add .getLocales to allow hacking on selecting locale based on what is available
- Remove functions that node-gettext already deprecated
- Add more types
- Use [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining#browser_compatibility) instead of lodash.get
- Be an ES module

### Project changes

- test with node:test and node:assert instead of mocha and chai; remove grunt
  - TODO: move from sinon to node:test's mocking facilities
- set up typescript in-editor checking (ie. turn on checkJs)
- stop using jshint
- set up prettier
- remove unused dependency
- use pnpm

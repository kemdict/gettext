# @kemdict/gettext Changelog

## v0.0.2 (unreleased)

### Changes

- Instead of setLocale and setTextDomain, use the new `bindLocale` function to get functions that translate to the given locale(s) (and domain). These functions can be used standalone. This removes state from the Gettext instance itself and makes races against `setLocale` impossible.
- Use a Map to store catalogs in the class. This should remove any concerns of prototype pollution, even though the translations being registered really are supposed to be trusted input. The types are clearer this way anyways. (Another approach to fix this is seen in [postalsys/gettext](https://github.com/postalsys/gettext/commit/63e627cece1592d03abadf36044c957b801c7315).)

### Removals

- Remove `.setLocale` and `.setTextDomain` and their C-style aliases in favor of the new `.bindLocale`

### Project changes

- Set up local coverage

## v0.0.1 (2025-12-30)

First forked version.

This version is tagged, but the release pipeline hasn't actually been set up. There's even a chance that this ends up published under my personal npm scope and not Kemdict's. But the changelog is getting annoyingly large, so I felt I should just mark it now.

### Changes

- Remove getLanguageCode since it's too simplistic
- Try to use the plural forms defined in the PO file. Fallback to using the locale to guess the plural forms only if it isn't found. When using locale to guess, also allow matching on regions, and add a default for Brazilian Portuguese.
  - This should fix [alexanderwallin/node-gettext#70](https://github.com/alexanderwallin/node-gettext/issues/70).
- Add guessLocale() to guess locale based on environment variables like GNU Gettext does.
- Add .setFirstAvailableLocale to allow passing in a list of preferred locales and using the first that is available in the catalogs
- Remove .addTranslations in favor of passing translations in in the constructor, because adding translations dynamically at runtime sounds like trouble
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

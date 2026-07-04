# @kemdict/gettext Changelog

## v0.1.3 (2026-07-04)

Add fallback plural forms for `nan` (Hokkien).

## v0.1.1, v0.1.2

Add some metadata, as well as set up publishing on tagging releases.

v0.1.1 did not successfully release since I tried to use publint without installing it. v0.1.2 actually goes through.

## v0.1.0 (2026-07-02)

### Feature

- Fall back to another language instead of straight to source text if it is untranslated.

  Previously, if multiple languages are specified (such as `ja:zh_TW:de:en`), the first language with a catalog would be chosen (let's say `zh_TW`), but then if a string isn't translated in that catalog it would fall straight back onto source text, instead of falling back onto the next language (in this case `de`).

  Making it fall back onto the next language matches the original Gettext.

- More plural forms are supported.

- *Trusted mode* for running plural forms as JS expressions.

### Removals

- Remove .getComment, which doesn't really make sense in a gettext runtime.
- Remove the event system (gettext.on, gettext.off, gettext.emit). It has only ever been used for errors, and adds complexity for something that I don't see any use of.
- Remove domains. Domains in upstream gettext is for loading multiple catalogs in the same app (same process), with there only being one “gettext instance”. In a class-based approach where you could just initialize a separate instance if you really need multiple message catalogs, domains are not necessary. As an example, Python's builtin gettext implementation also doesn't implement domains.
- Remove debug warnings about falling back to source text or another language.
- Remove the `debug` option.
- As all uses of the `.warn` method are gone, also remove gettext.warn.

## v0.0.2 (2026-02-04)

### Changes

- Include a Rollup plugin, `rollup-plugin-gettext`, for importing *and bundling* PO and MO files. This plugin will be published separately.
- Set up TypeScript declarations
- Add another GNU Hello clone which directly reads GNU Hello's installed message catalogs on the system (if any)
- Add a `loaders` module which provides functions for loading PO files from directories
- Rename `guessLocale` to `guessEnvLocale`, and allow it to take an object instead of directly reading from process.env, making it easier to test.
- Instead of setLocale and setTextDomain, use the new `bindLocale` function to get functions that translate to the given locale(s) (and domain). These functions can be used standalone. This removes state from the Gettext instance itself and makes races against `setLocale` impossible.
- Use a Map to store catalogs in the class. This should remove any concerns of prototype pollution, even though the translations being registered really are supposed to be trusted input. The types are clearer this way anyways. (Another approach to fix this is seen in [postalsys/gettext](https://github.com/postalsys/gettext/commit/63e627cece1592d03abadf36044c957b801c7315).)

### Removals

- Remove `.setLocale` and `.setTextDomain` and their C-style aliases in favor of the new `.bindLocale`

### Project changes

- Set up some limited performance testing
- Rename main test file to look better when there are multiple test files
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

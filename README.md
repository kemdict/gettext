# @kemdict/gettext

A fork of [node-gettext](https://github.com/alexanderwallin/node-gettext). The hope is to add more stuff to the runtime behavior of node-gettext, as well as add extraction features.

The main use is for [Kemdict](https://github.com/kemdict/kemdict).

The design of not directly depending on gettext-parser will be kept.

## Stability

I do not commit to any backwards compatibility whatsoever at this early stage.

The rest is from node-gettext's README; I'll rewrite it later.

---

## Features

* Supports contexts and plurals
* Load translations in the format returned by [gettext-parser](https://github.com/smhg/gettext-parser), so .json, .mo, and .po files can all be loaded
* Use plural forms from the PO file, with fallback for many languages

### Comparison with GNU gettext and node-gettext

(This is modified from node-gettext's explanation.)

1. **There is no global locale, nor is the current locale a state of the class.** When the Gettext instance itself holds the current locale and is used asynchronously (like on a server handling requests), [a request may set the locale to something else before another one has finished using it](https://github.com/alexanderwallin/node-gettext/issues/67). This library instead binds the “current” locale per set of translation functions.

   To infer the current locale from environment variables, use the `guessEnvLocale` function, which should read the LANG etc. variables basically just like GNU gettext does.

2. **There are no categories.** GNU gettext features [categories such as `LC_MESSAGES`, `LC_NUMERIC` and `LC_MONETARY`](https://www.gnu.org/software/gettext/manual/gettext.html#Locale-Environment-Variables), which are better handled with other libraries in the JS world. This is just like node-gettext.
3. **There are no domains.** Like [Python's gettext](https://docs.python.org/3/library/gettext.html), this library takes a class-based approach, so if you need multiple sets of translations simply use multiple instances of the `Gettext` class. node-gettext retains domains.
4. **Translations have to be loaded from the file system in a separate step.**

   GNU gettext is a C library that reads files from the file system: after using `bindtextdomain(domain, localesDirPath)` and `setlocale(category, locale)`, those four parameters are then used to read the appropriate translations file.

   This library (like `node-gettext`) has a goal to work both on the server and in browsers, and the file system may not always be available. Therefore it is up to the developer to read translation files from disk and provide them in the constructor.

   Various loaders are also provided as wrappers over `gettext-parser`; see below. In environments supporting Rollup plugins, use rollup-plugin-gettext (also developed in this repository) to import and bundle translation data.

## Installation

TODO. This package is not yet published; the name isn't even final yet (I'm not sure I actually want to publish this as @kemdict/gettext).

## Usage

```js
import Gettext from '@kemdict/gettext'
import swedishTranslations from './translations/sv-SE.json'

const gt = new Gettext({
  translations: {
    'sv-SE': swedishTranslations
  }
})
const { gettext } = gt.bindLocale('sv-SE')

gettext('The world is a funny place')
// -> "Världen är en underlig plats"
```

### Error events

```js
// Add translations etc...

gt.on('error', error => console.log('oh nose', error))
gettext('An unrecognized message')
// -> 'oh nose', 'An unrecognized message'
```

### Recipes

#### Load and add translations from .mo or .po files

`@kemdict/gettext` expects translations to be in the format specified by [`gettext-parser`](https://github.com/smhg/gettext-parser). We also provide various loaders to conveniently read translation files on disk.

```js
import Gettext from '@kemdict/gettext'
import { loadTranslations } from '@kemdict/gettext/loaders'
const gt = new Gettext({
  // this reads and parses all .po files under path/to/locales
  // their filenames are the locale names ('de.po' creates an entry for 'de')
  translations: loadTranslations('path/to/locales')
})
```

## Reference

### "@kemdict/gettext"

#### guessEnvLocale(env) → string[]

Guess or lookup the preferred language list from environment variables.

`env` defaults to `process.env`.

#### class Gettext({ sourceLocale, translations, debug })

The main class. This class holds the loaded translation catalogs.

`sourceLocale` specifies which locale source text is written in. I am not sure this is necessary or useful.

`debug` being true means to be verbose and warn about stuff at runtime.

`translations` is in the shape of `Record<string, GetTextTranslations>` where `GetTextTranslations` is the return type of `gettext-parser`'s parsers.

##### gettext.getLocales() → string[]

Return the list of locales that are in this gettext instance's catalog.

##### gettext.bindLocale(locales) → Translators

Return an object of translator functions that will translate as if `locales` is the “current” locale.

#### Translators

This object actually doesn't have a name in code but I'm abstracting them like this here.

This is an object of functions which can all be used standalone without needing to `.bind(this)`.

##### Translators.gettext(msgid), _(msgid)

Translate a string like gettext.

##### Translators.ngettext(msgid, msgidPlural, count)

Translate a string with plural handling like ngettext.

##### Translators.pgettext(msgctxt, msgid)

Translate a string with context like pgettext.

##### Translators.npgettext(msgctxt, msgid, msgidPlural, count)

Translate a string with context and plural handling like npgettext.

##### Translators.getComment(msgctxt, msgid)

Return the comment of the translation entry for `msgid` in the context `msgctxt`.

This is probably not something that a gettext runtime should expose…

### Loaders ("@kemdict/gettext/loaders.js")

#### bindtextdomain(domain, ...localesDirs) → Record<string, GetTextTranslations>

Load MO files from the directories `localesDirs`. These directories should be arranged like /usr/share/locale, i.e. `<locale>/LC_MESSAGES/<domain>.mo`.

Loading translations from [Elisa](http://apps.kde.org/elisa) if it's installed for example:

```typescript
import Gettext, { guessEnvLocale } from "@kemdict/gettext";
import { bindtextdomain } from "@kemdict/gettext/loaders";
const gt = new Gettext({
  translations: bindtextdomain("elisa", "/usr/share/locale/"),
});
const { pgettext } = gt.bindLocale(guessEnvLocale());
pgettext("@title:window", "Choose Folder") // 選擇資料夾 in zh_TW
```

#### loadTranslations(dir) → Record<string, GetTextTranslations>

Load PO files from `dir`. `dir` should contain one PO file for each locale, like `<dir>/zh_TW.po`, `<dir>/de.po`, `<dir>/sv.po`, and so on.

## License

MIT

## See also

- [node-gettext](https://github.com/alexanderwallin/node-gettext) - where this library forked from, because I have way too many major changes that I want to implement
- [gettext-parser](https://github.com/smhg/gettext-parser) - Parsing and compiling gettext translations between .po/.mo files and JSON
- [lioness](https://github.com/alexanderwallin/lioness) - Gettext library for React
- [react-gettext-parser](https://github.com/laget-se/react-gettext-parser) - Extracting gettext translatable strings from JS(X) code

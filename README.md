# @kemdict/gettext

A fork of [node-gettext](https://github.com/alexanderwallin/node-gettext). The hope is to add more stuff to the runtime behavior of node-gettext, as well as add extraction features.

The main use is for [Kemdict](https://github.com/kemdict/kemdict).

The design of not directly depending on gettext-parser will be kept.

## Stability

I do not commit to any backwards compatibility whatsoever at this early stage.

The rest is from node-gettext's README; I'll rewrite it later.

---

## Features

* Supports domains, contexts and plurals
* Supports .json, .mo and .po files with the help of [gettext-parser](https://github.com/smhg/gettext-parser)
* Use plural forms from the PO file, with fallback for 137 languages
* ~~Change locale or domain on the fly~~ to be figured out later
* Useful error messages enabled by a `debug` option
* Emits events for internal errors, such as missing translations

### Differences from node-gettext

TODO

### Differences from GNU gettext

(TODO. This is from node-gettext.)

There are two main differences between `node-gettext` and GNU's gettext:

1. **There are no categories.** GNU gettext features [categories such as `LC_MESSAGES`, `LC_NUMERIC` and `LC_MONETARY`](https://www.gnu.org/software/gettext/manual/gettext.html#Locale-Environment-Variables), but since there already is a plethora of great JavaScript libraries to deal with numbers, currencies, dates etc, `node-gettext` is simply targeted towards strings/phrases. You could say it just assumes the `LC_MESSAGES` category at all times.
2. **You have to read translation files from the file system yourself.** GNU gettext is a C library that reads files from the file system. This is done using `bindtextdomain(domain, localesDirPath)` and `setlocale(category, locale)`, where these four parameters combined are used to read the appropriate translations file.

  However, since `node-gettext` needs to work both on the server in web browsers (which usually is referred to as it being *universal* or *isomorphic* JavaScript), it is up to the developer to read translation files from disk or somehow provide it with translations then pass them in in the constructor.

  `bindtextdomain` will be provided as an optional feature in a future release.


## Installation

```sh
npm install --save node-gettext
```


## Usage

```js
import Gettext from 'node-gettext'
import swedishTranslations from './translations/sv-SE.json'

const gt = new Gettext({
  translations: {
    'sv-SE': {
      messages: swedishTranslations
    }
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

`node-gettext` expects all translations to be in the format specified by [`gettext-parser`](https://github.com/smhg/gettext-parser). Therefor, you should use that to parse .mo or .po files.

Here is an example where we read a bunch of translation files from disk and add them to our `Gettext` instance:

```js
import fs from 'fs'
import path from 'path'
import Gettext from 'node-gettext'
import { po } from 'gettext-parser'

// In this example, our translations are found at
// path/to/locales/LOCALE/DOMAIN.po
const translationsDir = 'path/to/locales'
const locales = ['en', 'fi-FI', 'sv-SE']
const domain = 'messages'

const gt = new Gettext({
  translations: (() => {
    const catalog = {}
    locales.forEach((locale) => {
      const fileName = `${domain}.po`
      const translationsFilePath = path.join(translationsDir, locale, fileName)
      const translationsContent = fs.readFileSync(translationsFilePath)

      const parsedTranslations = po.parse(translationsContent)
      catalog[locale] = { [domain]: parsedTranslations }
    })
  })()
})
```


## API

<a name="Gettext"></a>

## Gettext

* [Gettext](#Gettext)
    * [new Gettext([options])](#new_Gettext_new)
    * [.on(eventName, callback)](#Gettext+on)
    * [.off(eventName, callback)](#Gettext+off)
    * [.bindLocale(locales, domain)](#Gettext+bindLocale)
    * [.getLocales()](#Gettext+getLocales)
    * [.gettext(msgid)](#Gettext+gettext) ⇒ <code>String</code>
    * [.dgettext(domain, msgid)](#Gettext+dgettext) ⇒ <code>String</code>
    * [.ngettext(msgid, msgidPlural, count)](#Gettext+ngettext) ⇒ <code>String</code>
    * [.dngettext(domain, msgid, msgidPlural, count)](#Gettext+dngettext) ⇒ <code>String</code>
    * [.pgettext(msgctxt, msgid)](#Gettext+pgettext) ⇒ <code>String</code>
    * [.dpgettext(domain, msgctxt, msgid)](#Gettext+dpgettext) ⇒ <code>String</code>
    * [.npgettext(msgctxt, msgid, msgidPlural, count)](#Gettext+npgettext) ⇒ <code>String</code>
    * [.dnpgettext(domain, msgctxt, msgid, msgidPlural, count)](#Gettext+dnpgettext) ⇒ <code>String</code>

<a name="new_Gettext_new"></a>
### new Gettext([options])

Create a new Gettext instance.

Options:

- sourceLocale (string, optional): the locale the text in source code is written in.
- debug (boolean, optionsl): whether to output debug info.

<a name="Gettext+on"></a>
### gettext.on(eventName, callback)
Adds an event listener.

- eventName: which event the callback should be called on. There is only one event at the moment, `error`.
- callback: the function to be called on the event. In the case of `error`, it gets passed an error object.

<a name="Gettext+off"></a>
### gettext.off(eventName, callback)
Removes an event listener.

- eventName: An event name
- callback: A previously registered event handler function

<a name="Gettext+bindLocale"></a>
### gettext.bindLocale(locales, domain)
Return translator functions that translate into `locales`.
If `locales` is a string, that's the locale used. If it's an array, the first one that is available in catalogs will be used.
If none of the specified locales are translated in the catalogs, the returned functions will all simply return source strings as-is.

**Params**

- `locales`: string or array of strings - A locale
- `domain`: string - A domain, defaults to "messages"

**Example**  
```js
const { _ } = gt.bindLocale('sv-SE')
```

<a name="Gettext+getLocales"></a>
### gettext.getLocales(locale)
Return all locales in the catalog.

<a name="Gettext+gettext"></a>
### gettext.gettext(msgid)
Return the translated string for `msgid` using the current locale in the current domain.

If no translation was found, return the original string.

**Example**
```js
gt.gettext('Some text')
```

<a name="Gettext+dgettext"></a>
### gettext.dgettext(domain, msgid)
Translates a string using a specific domain

<a name="Gettext+ngettext"></a>
### gettext.ngettext(msgid, msgidPlural, count)
Translates a plural string using the current domain.

- `msgid`: <code>String</code> - String to be translated when count is singular
- `msgidPlural`: <code>String</code> - String to be translated when count is plural
- `count`: <code>Number</code> - Number count for the plural

**Example**  
```js
gt.ngettext('One thing', 'Many things', numberOfThings)
```

<a name="Gettext+dngettext"></a>
### gettext.dngettext(domain, msgid, msgidPlural, count)
Translates a plural string using a specific textdomain

- `domain`: <code>String</code> - A gettext domain name
- `msgid`: <code>String</code> - String to be translated when count is not plural
- `msgidPlural`: <code>String</code> - String to be translated when count is plural
- `count`: <code>Number</code> - Number count for the plural

**Example**  
```js
gt.dngettext('domainname', 'One thing', 'Many things', numberOfThings)
```

<a name="Gettext+pgettext"></a>
### gettext.pgettext(msgctxt, msgid)
Translates a string from a specific context using the default textdomain

- `msgctxt`: <code>string</code> - Translation context
- `msgid`: <code>string</code> - String to be translated

**Example**  
```js
gt.pgettext('in:menu', 'Back')
```

<a name="Gettext+dpgettext"></a>

### gettext.dpgettext(domain, msgctxt, msgid)
Translates a string from a specific context using a specific textdomain

**Returns**: <code>String</code> - Translation or the original string if no translation was found  
**Params**

- `domain`: <code>String</code> - A gettext domain name
- `msgctxt`: <code>String</code> - Translation context
- `msgid`: <code>String</code> - String to be translated

**Example**  
```js
gt.dpgettext('domainname', 'sports', 'Back')
```

<a name="Gettext+npgettext"></a>
### gettext.npgettext(msgctxt, msgid, msgidPlural, count)
Translates a plural string from a specific context using the default textdomain

**Returns**: <code>String</code> - Translation or the original string if no translation was found  
**Params**

- `msgctxt`: <code>String</code> - Translation context
- `msgid`: <code>String</code> - String to be translated when count is not plural
- `msgidPlural`: <code>String</code> - String to be translated when count is plural
- `count`: <code>Number</code> - Number count for the plural

**Example**  
```js
gt.npgettext('sports', 'Back', '%d backs', numberOfBacks)
```

<a name="Gettext+dnpgettext"></a>
### gettext.dnpgettext(domain, msgctxt, msgid, msgidPlural, count) ⇒ <code>String</code>
Translates a plural string from a specifi context using a specific textdomain

**Returns**: <code>String</code> - Translation or the original string if no translation was found  
**Params**

- `domain`: <code>String</code> - A gettext domain name
- `msgctxt`: <code>String</code> - Translation context
- `msgid`: <code>String</code> - String to be translated
- `msgidPlural`: <code>String</code> - If no translation was found, return this on count!=1
- `count`: <code>Number</code> - Number count for the plural

**Example**  
```js
gt.dnpgettext('domainname', 'sports', 'Back', '%d backs', numberOfBacks)
```

## Migrating from v1 to v2

Version 1 of `node-gettext` confused domains with locales, which version 2 has corrected. `node-gettext` also no longer parses files or file paths for you, but accepts only ready-parsed JSON translation objects.

Here is a full list of all breaking changes:

* `textdomain(domain)` is now `setLocale(locale)`
* `dgettext`, `dngettext`, `dpgettext` and `dnpgettext` does not treat the leading `domain` argument as a locale, but as a domain. To get a translation from a certain locale you need to call `setLocale(locale)` beforehand.
* A new `setTextDomain(domain)` has been introduced
* `addTextdomain(domain, file)` is now `addTranslations(locale, domain, translations)`
* `addTranslations(locale, domain, translations)` **only accepts a JSON object with the [shape described in the `gettext-parser` README](https://github.com/smhg/gettext-parser#data-structure-of-parsed-mopo-files)**. To load translations from .mo or .po files, use [gettext-parser](https://github.com/smhg/gettext-parser), and it will provide you with valid JSON objects.
* `_currentDomain` is now `domain`
* `domains` is now `catalogs`
* The instance method `__normalizeDomain(domain)` has been replaced by a static method `Gettext.getLanguageCode(locale)`


## License

MIT

## See also

* [gettext-parser](https://github.com/smhg/gettext-parser) - Parsing and compiling gettext translations between .po/.mo files and JSON
* [lioness](https://github.com/alexanderwallin/lioness) – Gettext library for React
* [react-gettext-parser](https://github.com/laget-se/react-gettext-parser) - Extracting gettext translatable strings from JS(X) code
* [narp](https://github.com/laget-se/narp) - Workflow CLI tool that syncs translations between your app and Transifex

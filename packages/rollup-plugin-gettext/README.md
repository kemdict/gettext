# rollup-plugin-gettext

Import PO or MO files when using Rollup or Vite, parsing translation catalogs through [gettext-parser](https://github.com/smhg/gettext-parser).

This does not handle extraction or translating at runtime.

## Usage

First, enable the plugin(s). In Vite or Rollup:

```typescript
// vite.config.js or rollup.config.js
import { mo, po } from "rollup-plugin-gettext";
export default {
  plugins: [mo(), po()] // order doesn't matter, pick either or both
}
```

In Astro:

```typescript
// astro.config.js
import { mo, po } from "rollup-plugin-gettext";
export default {
  vite: {
    plugins: [mo(), po()] // order doesn't matter, pick either or both
  }
}
```

Then in your code:

```typescript
import de from "./locale/de.po"
// equivalent to (await import("gettext-parser")).po.parse(readFileSync("./locale/de.po"))
// except Vite/Rollup will bundle the value making it usable on the client side
```

Or, more usefully:

```typescript
import translations1 from "po:./dir/with/po/files"
import translations2 from "mo:./dir/with/mo/files"
```

this will import each of the PO files in the directory, and make them available as an object with keys being their basenames without extensions, and values being `{messages: GetTextTranslations}`. (“messages” is temporary and will be removed. That's a gettext domain but it's not actually read from anything.)

Types: TODO

## Reference

po: plugin for importing PO files (either a single one or a directory of them)
  options: TODO
mo: plugin for importing MO files (either a single one or a directory of them)
  options: TODO

## Road to release (0.1.0)

- typescript types, there should be a type module that can be referenced in tsconfig or some good way to do this
- remove domains

## Acknowledgements

- I referenced [@miyaneee/rollup-plugin-json5](https://github.com/Miyaneee/rollup-plugin-json5) for how a Rollup plugin like this should be structured (that plugin seems to also be based on @rollup/json)
- I referenced @rollup/data-uri and [rollup-plugin-glob-import](https://github.com/gjbkz/rollup-plugin-glob-import) as well as @rollup/image for how to load data

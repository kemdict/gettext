# rollup-plugin-gettext

Import PO or MO files when using Rollup or Vite, parsing translation catalogs through [gettext-parser](https://github.com/smhg/gettext-parser).

This does not handle extraction or translating at runtime.

## Config

```typescript
// vite.config.js or rollup.config.js
import { mo, po } from "rollup-plugin-gettext";
export default {
  plugins: [mo(), po()] // order doesn't matter, pick either or both
}
```

```typescript
// astro.config.js
import { mo, po } from "rollup-plugin-gettext";
export default {
  vite: {
    plugins: [mo(), po()] // order doesn't matter, pick either or both
  }
}
```

To get types for the data imported with this plugin, add a `/// <reference types="rollup-plugin-gettext/module-types />"` to a global declaration file or to the file where you're importing them, or put it into `lib` in `tsconfig.json`.

## Usage

```typescript
import de from "./locale/de.po"
import de from "po:./locale/de.po"
import de from "./locale/de.mo"
import de from "mo:./locale/de.mo"
```

This is equivalent to `(await import("gettext-parser")).po.parse(readFileSync("./locale/de.po"))`, except Vite/Rollup will bundle the value making it usable eg. on the client side.

Note that using MO files doesn't really have a difference in performance here.

Or, more usefully:

```typescript
import translations1 from "po:./dir/with/po/files"
import translations2 from "mo:./dir/with/mo/files"
```

this will import each of the PO files in the directory, and make them available as an object with keys being their basenames without extensions, and values being `{messages: GetTextTranslations}`. (“messages” is temporary and will be removed. That's a gettext domain but it's not actually read from anything.)

The translations imported this way can be passed directly into the `@kemdict/gettext` runtime.

## Options

- po:
  - parserOptions: options to pass to the PO file parser from `gettext-parser`.

    This is a nested object *just in case* it turns out the plugin could use some other options. (Currently this just has `defaultCharset` and `validation` in it, see the docs for `gettext-parser`.)

- mo:
  - defaultCharset: passed into the MO file parser from `gettext-parser`.

## Acknowledgements

- I referenced [@miyaneee/rollup-plugin-json5](https://github.com/Miyaneee/rollup-plugin-json5) for how a Rollup plugin like this should be structured (that plugin seems to also be based on @rollup/json)
- I referenced @rollup/data-uri and [rollup-plugin-glob-import](https://github.com/gjbkz/rollup-plugin-glob-import) as well as @rollup/image for how to load data
- https://github.com/figma/vite-plugin-yaml for how to set up types

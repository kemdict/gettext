# rollup-plugin-gettext

Import PO or MO files when using Rollup or Vite, parsing translation catalogs through [gettext-parser](https://github.com/smhg/gettext-parser).

This does not handle extraction or translating at runtime.

## Usage

Rollup or Vite:

```typescript
// rollup.config.js or vite.config.js
import { mo, po } from "rollup-plugin-gettext";
export default {
  plugins: [mo(), po()] // order doesn't matter, pick either or both
}
```

Then import files like `./path/to/file.po` or `./path/to/file.mo`.

Astro:

```typescript
// astro.config.js
import { mo, po } from "rollup-plugin-gettext";
export default {
  vite: {
    plugins: [mo(), po()] // order doesn't matter, pick either or both
  }
}
```

Then import files like `./path/to/file.po` or `./path/to/file.mo`.

TODO: import directories like `po:./path` or `import foo from "./path" with {type: "po"}`
TODO: typescript types, there should be a type module that can be referenced in tsconfig

## Acknowledgements

- I referenced [@miyaneee/rollup-plugin-json5](https://github.com/Miyaneee/rollup-plugin-json5) for how a Rollup plugin like this should be structured (that plugin seems to also be based on @rollup/json)
- I referenced @rollup/data-uri and [rollup-plugin-glob-import](https://github.com/gjbkz/rollup-plugin-glob-import) for how to load data during resolveId

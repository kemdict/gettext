# rollup-plugin-gettext

Import PO or MO files when using Rollup. Does not handle extraction or translating at runtime.

Parsing happens through [gettext-parser](https://github.com/smhg/gettext-parser).

References:

- @miyaneee/rollup-plugin-json5

## Usage

```typescript
import { po } from "rollup-plugin-gettext";

export default {
  // …
  plugins: [po()]
}
```

Then import directories like `po:dir/to/foo/bar/` or files like `./path/to/file.po`.

import { transform } from "@astrojs/compiler";
import fs from "node:fs";
import { $ } from "zx";

const code = (
    await transform(
        fs.readFileSync("./components/Welcome.astro", {
            encoding: "utf-8",
        }),
    )
).code;
// location is useless the way we're doing this
await $({
    input: code,
})`xgettext -L javascript --no-location - -o template.pot`;

import { spawnSync } from "node:child_process";
import { glob } from "node:fs";
import { parseArgs } from "node:util";

// TODO:
// - get list of files
// - for each file:
//   - somehow transform into JS
//   - somehow keep comment locations
// - somehow pass all transformed result into xgettext

const parsedArgs = parseArgs({
    allowPositionals: true,
    args: process.argv.slice(2),
    options: {
        help: { type: "boolean", short: "h" },
    },
});
if (parsedArgs.values.help) {
    console.log(``);
}

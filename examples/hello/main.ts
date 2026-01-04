import Gettext, { guessEnvLocale } from "@kemdict/gettext";
import { po } from "gettext-parser";
import { parseArgs } from "node:util";
import fs from "node:fs";
import path from "node:path";
import { sprintf } from "sprintf-js";

import type { GetTextTranslations } from "gettext-parser";
type Catalog = Record<string, GetTextTranslations>;

function loadTranslations() {
    const podir = path.join(import.meta.dirname, "po");
    const catalogs: Record<string, Catalog> = {};
    for (const file of fs.readdirSync(podir)) {
        if (file.endsWith(".po")) {
            const translations = po.parse(
                fs.readFileSync(path.join(podir, file)),
            );
            catalogs[file.slice(0, -3)] = { messages: translations };
        }
    }
    return catalogs;
}
const gt = new Gettext({
    translations: loadTranslations(),
});
const { _, ngettext } = gt.bindLocale(guessEnvLocale());

const helptext = _(`
@kemdict/gettext hello example - show hello world

(The name is inspired by GNU Hello, which has the same purpose.)

Options:

--help: show help (this message)
`);

const parsedArgs = parseArgs({
    allowPositionals: true,
    args: process.argv.slice(2),
    options: {
        help: { type: "boolean", short: "h" },
    },
});
if (parsedArgs.values.help) {
    console.log(helptext);
} else {
    console.log(_("Hello world!"));
    console.log(
        sprintf(
            ngettext(
                `You provided %s positional argument.`,
                `You provided %s positional arguments.`,
                parsedArgs.positionals.length,
            ),
            parsedArgs.positionals.length,
        ),
    );
}

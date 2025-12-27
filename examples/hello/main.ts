import Gettext from "@kemdict/gettext";
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

// TODO: for a cli app, how to read this from the environment?
// LANGUAGE, LC_ALL, LC_MESSAGES, LANG
// TODO: fallback. Catalog should probably not be per Gettext instance.

// Rudimentary $LANGUAGE reading
const availableLocales = new Set(gt.getLocales());
let locale = "";
for (const preferred of process.env["LANGUAGE"]?.split(":") ?? []) {
    if (availableLocales.has(preferred)) {
        locale = preferred;
        break;
    }
}
gt.setLocale(locale);

const _ = gt.gettext.bind(gt);
const ngettext = gt.ngettext.bind(gt);

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

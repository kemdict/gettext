import Gettext from "@kemdict/gettext";
import { po } from "gettext-parser";
import { parseArgs } from "node:util";
import fs from "node:fs";
import path from "node:path";
import { sprintf } from "sprintf-js";

function loadTranslations(gt: Gettext) {
    const podir = path.join(import.meta.dirname, "po");
    for (const file of fs.readdirSync(podir)) {
        if (file.endsWith(".po")) {
            const translations = po.parse(fs.readFileSync(file));
            gt.addTranslations(file.slice(0, -3), "messages", translations);
        }
    }
}
const gt = new Gettext();
loadTranslations(gt);
gt.setLocale("zh_TW");
const _ = gt.gettext.bind(gt);
const ngettext = gt.ngettext.bind(gt);

const helptext = _(`
@kemdict/gettext hello example - show hello world

(The name is inspired by GNU Hello, which has the same purpose.)

Options:

--upper: Upcase message before showing
--lower: Downcase message before showing
--help: Show help (this message)
`);

const parsedArgs = parseArgs({
    allowPositionals: true,
    args: process.argv.slice(2),
    options: {
        help: { type: "boolean", short: "h" },
        upper: { type: "boolean", short: "u" },
        lower: { type: "boolean", short: "l" },
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

import Gettext, { guessEnvLocale } from "@kemdict/gettext";
// TODO the export needs to be set up properly
import { loadTranslations } from "../../lib/loaders.js";
import { parseArgs } from "node:util";
import path from "node:path";
import { sprintf } from "sprintf-js";

const gt = new Gettext({
    translations: loadTranslations(path.join(import.meta.dirname, "po")),
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

import Gettext, { guessEnvLocale } from "@kemdict/gettext";
import { bindtextdomain } from "@kemdict/gettext/loaders.js";
import { parseArgs } from "node:util";
import { sprintf } from "sprintf-js";

const gt = new Gettext({
    translations: bindtextdomain(
        "hello",
        "/usr/share/locale-langpack",
        "/usr/share/locale",
    ),
});
const { _ } = gt.bindLocale(guessEnvLocale());

const program_name = "hello";

function emitTryHelp() {
    process.stderr.write(
        sprintf(_("Try '%s --help' for more information.\n"), program_name),
    );
}

const fputs = (str: string) => process.stdout.write(str);
const fprintf = (str: string, ...args: any[]) => fputs(sprintf(str, ...args));

function printHelp() {
    /* TRANSLATORS: --help output 1 (synopsis)
       no-wrap */
    fprintf(_("Usage: %s [OPTION]...\n"), program_name);
    /* TRANSLATORS: --help output 2 (brief description)
       no-wrap */
    fputs(_("Print a friendly, customizable greeting.\n"));
    fputs("\n");
    /* TRANSLATORS: --help output 3: options
       no-wrap */
    fputs(_("  -t, --traditional       use traditional greeting\n"));
    fputs(_("  -g, --greeting=TEXT     use TEXT as the greeting message\n"));
    fputs("\n");
    fputs(_("      --help     display this help and exit\n"));
    fputs(_("      --version  output version information and exit\n"));
}

function main() {
    try {
        const parsedArgs = parseArgs({
            args: process.argv.slice(2),
            options: {
                greeting: { type: "string", short: "g" },
                traditional: { type: "boolean", short: "t" },
                help: { type: "boolean", short: "h" },
                version: { type: "boolean", short: "v" },
            },
        });
        let greetingMsg = _("Hello, world!");
        if (parsedArgs.values.version) {
            console.log("hello example that mimics GNU Hello");
            process.exit(0);
        } else if (parsedArgs.values.greeting) {
            greetingMsg = parsedArgs.values.greeting;
        } else if (parsedArgs.values.help) {
            printHelp();
            process.exit(0);
        } else if (parsedArgs.values.traditional) {
            greetingMsg = _("hello, world");
        }

        console.log(greetingMsg);
    } catch (e) {
        const typed = e as Error & { code: string };
        if (typed.code === "ERR_PARSE_ARGS_UNEXPECTED_POSITIONAL") {
            console.error(sprintf("%s: %s", _("extra operand"), e.message));
        }
        emitTryHelp();
        process.exit(1);
    }
}

main();

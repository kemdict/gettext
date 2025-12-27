import Gettext from "@kemdict/gettext";
import { parseArgs } from "node:util";

const helptext = `
@kemdict/gettext hello example - show hello world

(The name is inspired by GNU Hello, which has the same purpose.)

Options:

--upper: Upcase message before showing
--lower: Downcase message before showing
--help: Show help (this message)
`;

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
    console.log("Hello world!");
    console.log(
        `You provided ${parsedArgs.positionals.length} positional arguments.`,
    );
}

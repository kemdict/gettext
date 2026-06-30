import { $, chalk } from "zx";
import { po } from "gettext-parser";
import fs from "node:fs";
import Gettext from "../lib/gettext.js";

async function download() {
    const $$ = $({ verbose: true });
    await $$`svn checkout svn+ssh://svn@svn.kde.org/home/kde/trunk/l10n-kf6 -rHEAD l10n-kf6`;
}

function loadFile(path: string) {
    const translations = po.parse(fs.readFileSync(path));
    const language = (translations.headers["Language"] as string) || "unset";
    return {
        [language]: translations,
    };
}

const files = (await $({ nothrow: true })`fd --no-ignore -e po`).stdout
    .split("\n")
    .filter(Boolean);
let percentage: number | undefined = undefined;
for (let i = 1; i <= files.length; i++) {
    const path = files[i];
    const nextPercentage = Math.floor(100 * (i / files.length));
    if (percentage !== nextPercentage) console.error(`${nextPercentage}%`);
    percentage = nextPercentage;
    try {
        new Gettext({ translations: loadFile(path) });
    } catch (e) {
        console.log(`${chalk.bold("Error")} reading ${chalk.cyan(path)}:`);
        console.log(chalk.gray((e as { message: string }).message));
    }
}

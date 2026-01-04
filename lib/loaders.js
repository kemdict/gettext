/** @import {Catalog, Locale} from "./gettext.js" */

import * as fs from "node:fs";
import * as path from "node:path";
import { po, mo } from "gettext-parser";

/**
 * Load MO translations the directories `localesDirs`.
 *
 * These directories should be arranged similar to /usr/share/locale, like
 * <dir>/<locale>/LC_MESSAGES/<domain>.mo.
 *
 * @param {string} domain
 * @param {...string} localesDirs
 */
export function bindtextdomain(domain, ...localesDirs) {
    /** @type Record<Locale, Catalog> */
    const catalogs = {};
    for (const localesDir of localesDirs) {
        if (!fs.existsSync(localesDir)) continue;
        for (const locale of fs.readdirSync(localesDir)) {
            const localePath = path.join(localesDir, locale);
            if (!fs.statSync(localePath).isDirectory()) continue;
            const messagesPath = path.join(localePath, "LC_MESSAGES");
            if (!fs.existsSync(messagesPath)) continue;
            if (!fs.statSync(messagesPath).isDirectory()) continue;
            const domainPath = path.join(messagesPath, `${domain}.mo`);
            if (!fs.existsSync(domainPath)) continue;

            const translations = mo.parse(fs.readFileSync(domainPath));
            catalogs[locale] = { messages: translations };
        }
    }
    return catalogs;
}

/**
 * Load PO translations from `dir`.
 * `dir` should be structured like <dir>/<locale>.po.
 * @param {string} dir
 */
export function loadTranslations(dir) {
    /** @type Record<Locale, Catalog> */
    const catalogs = {};
    for (const file of fs.readdirSync(dir)) {
        if (file.endsWith(".po")) {
            const translations = po.parse(
                fs.readFileSync(path.join(dir, file)),
            );
            catalogs[file.slice(0, -3)] = { messages: translations };
        }
    }
    return catalogs;
}

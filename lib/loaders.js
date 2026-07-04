/** @import {Catalog, Locale} from "./gettext.js" */

import { po } from "gettext-parser";

/**
 * Load PO translations from an object mapping file paths to content strings,
 * such as those from Vite's import.meta.glob.
 * @param {Record<string, string | { default: string }>} obj
 */
export function loadTranslationsFromObject(obj) {
    /** @type Record<Locale, Catalog> */
    const catalogs = {};
    for (const [file, content] of Object.entries(obj)) {
        if (file.endsWith(".po")) {
            const actualContent =
                typeof content === "string" ? content : content.default;
            const translations = po.parse(actualContent);
            // We don't have access to node:path.basename here.
            const basename = file.replace(/^.*[\/\\]/, "").slice(0, -3);
            catalogs[basename] = translations;
        }
    }
    return catalogs;
}

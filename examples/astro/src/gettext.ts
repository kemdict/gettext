import Gettext from "@kemdict/gettext";
import path from "node:path";
import fs from "node:fs";
import { po } from "gettext-parser";

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
gt.setLocale("zh_TW");

export const _ = gt.gettext.bind(gt);
export const ngettext = gt.ngettext.bind(gt);

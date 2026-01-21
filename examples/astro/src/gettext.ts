import Gettext from "@kemdict/gettext";
import { loadTranslations } from "@kemdict/gettext/loaders.js";
import path from "node:path";

export const gt = new Gettext({
    translations: loadTranslations(path.join(import.meta.dirname, "po")),
});

import Gettext from "@kemdict/gettext";
import { loadTranslations } from "../../../lib/loaders";
import path from "node:path";

export const gt = new Gettext({
    translations: loadTranslations(path.join(import.meta.dirname, "po")),
});

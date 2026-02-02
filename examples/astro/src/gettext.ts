import Gettext from "@kemdict/gettext";
import translations from "po:./po";
import zh_TW from "./po/zh_TW.po";

export const gt = new Gettext({
    translations: translations,
});

import Gettext, { guessEnvLocale } from "@kemdict/gettext";

import poTranslations from "po:./po";
import moTranslations from "mo:./mo";
import onePoNoPrefix from "./po/zh_TW.po";
import oneMoNoPrefix from "./mo/zh_TW.mo";
// TODO
// import onePoWithPrefix from "po:./po/zh_TW.po";
// import oneMoWithPrefix from "mo:./mo/zh_TW.mo";

const { _ } = new Gettext({ translations: poTranslations }).bindLocale(
    guessEnvLocale(),
);

console.log(_("Hello!"));

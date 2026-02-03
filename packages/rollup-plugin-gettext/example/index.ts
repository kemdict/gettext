import assert from "node:assert/strict";
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
assert.deepEqual(Object.keys(poTranslations).sort(), ["nan_TW", "zh_TW"]);
assert.deepEqual(Object.keys(moTranslations).sort(), ["nan_TW", "zh_TW"]);
assert.equal(onePoNoPrefix.headers["Language"], "zh_TW");
assert.equal(oneMoNoPrefix.headers["Language"], "zh_TW");

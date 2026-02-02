import Gettext from "@kemdict/gettext";
import zh_TW from "./po/zh_TW.po";

export const gt = new Gettext({
    translations: {
        // TODO: get rid of domains in this library
        zh_TW: { messages: zh_TW },
    },
});

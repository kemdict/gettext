import { expect, it, describe } from "vitest";

import Gettext from "../../../lib/gettext.js";

it("imports PO and MO directories with a prefix", async () => {
    const poTranslations = (await import("po:./po")).default;
    const moTranslations = (await import("mo:./mo")).default;
    expect(Object.keys(poTranslations).sort()).toStrictEqual([
        "nan_TW",
        "zh_TW",
    ]);
    expect(Object.keys(moTranslations).sort()).toStrictEqual([
        "nan_TW",
        "zh_TW",
    ]);
});

describe("imported directories can be passed directly into @kemdict/gettext", () => {
    it("PO", async () => {
        const poTranslations = (await import("po:./po")).default;
        const { _ } = new Gettext({ translations: poTranslations }).bindLocale(
            "zh_TW",
        );
        expect(_("Hello!")).toEqual("你好！");
    });
    it("MO", async () => {
        const moTranslations = (await import("mo:./mo")).default;
        const { _ } = new Gettext({ translations: moTranslations }).bindLocale(
            "nan_TW",
        );
        expect(_("Hello!")).toEqual("Lí hó!");
    });
});

it("imports PO and MO files without prefix", async () => {
    const onePoNoPrefix = (await import("./po/zh_TW.po")).default;
    const oneMoNoPrefix = (await import("./mo/nan_TW.mo")).default;
    expect(onePoNoPrefix.headers["Language"]).toEqual("zh_TW");
    expect(oneMoNoPrefix.headers["Language"]).toEqual("nan_TW");
});

it("imports PO and MO files with prefix", async () => {
    const onePoWithPrefix = (await import("po:./po/zh_TW.po")).default;
    const oneMoWithPrefix = (await import("mo:./mo/nan_TW.mo")).default;
    expect(onePoWithPrefix.headers["Language"]).toEqual("zh_TW");
    expect(oneMoWithPrefix.headers["Language"]).toEqual("nan_TW");
});

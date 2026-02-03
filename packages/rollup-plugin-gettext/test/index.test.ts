import { expect, test, describe } from "vitest";

import Gettext from "@kemdict/gettext";

test("imports PO and MO directories with a prefix", async () => {
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

describe("loading translations", () => {
    test("PO", async () => {
        const poTranslations = (await import("po:./po")).default;
        const { _ } = new Gettext({ translations: poTranslations }).bindLocale(
            "zh_TW",
        );
        expect(_("Hello!")).toEqual("你好！");
    });
    test("MO", async () => {
        const moTranslations = (await import("mo:./mo")).default;
        const { _ } = new Gettext({ translations: moTranslations }).bindLocale(
            "nan_TW",
        );
        expect(_("Hello!")).toEqual("Lí hó!");
    });
});

test("imports PO and MO files without prefix", async () => {
    const onePoNoPrefix = (await import("./po/zh_TW.po")).default;
    const oneMoNoPrefix = (await import("./mo/nan_TW.mo")).default;
    expect(onePoNoPrefix.headers["Language"]).toEqual("zh_TW");
    expect(oneMoNoPrefix.headers["Language"]).toEqual("nan_TW");
});

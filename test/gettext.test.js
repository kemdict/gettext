"use strict";

import Gettext, { guessEnvLocale } from "../lib/gettext.js";
import fs from "node:fs";
import assert from "node:assert/strict";
import { describe, beforeEach, it, mock } from "node:test";
import { po } from "gettext-parser";

describe("Plurals", () => {
    it("should handle KDE Ukrainian fine", () => {
        const gt = new Gettext({
            translations: {
                uk: po.parse(
                    fs.readFileSync(
                        import.meta.dirname + "/fixtures/dolphin-uk.po",
                        {
                            encoding: "utf-8",
                        },
                    ),
                ),
            },
        });
        const { npgettext, ngettext } = gt.bindLocale("uk");
        /** @param {number} count */
        function testMsg1(count) {
            return npgettext(
                "@action:inmenu Restore the selected files that are in the trash to the place " +
                    "they lived at the moment they were trashed. Minimize the length of this " +
                    "string if possible.",
                "Restore to Former Location",
                "Restore to Former Locations",
                count,
            );
        }
        assert.equal(testMsg1(0), "Відновити попередні місця");
        assert.equal(testMsg1(1), "Відновити попереднє місце");
        assert.equal(testMsg1(2), "Відновити попередні місця");
        assert.equal(testMsg1(3), "Відновити попередні місця");
        /** @param {number} count */
        function testMsg2(count) {
            return ngettext(
                "Are you sure you want to open 1 terminal window?",
                "Are you sure you want to open %1 terminal windows?",
                count,
            );
        }
        assert.equal(
            testMsg2(21),
            "Ви справді хочете відкрити %1 вікно термінала?",
        );
        assert.equal(
            testMsg2(1),
            "Ви справді хочете відкрити вікно термінала?",
        );
        assert.equal(
            testMsg2(24),
            "Ви справді хочете відкрити %1 вікна термінала?",
        );
    });
});

describe("guessEnvLocale", () => {
    it("should have the expected order", () => {
        assert.deepEqual(
            guessEnvLocale({
                LANGUAGE: "a:b:c",
                LC_MESSAGES: "d",
                LC_ALL: "e",
                LANG: "f",
            }),
            ["a", "b", "c", "e", "d", "f"],
        );
        assert.deepEqual(
            guessEnvLocale({
                LANGUAGE: "ja:zh_TW:en",
                LANG: "foo",
            }),
            ["ja", "zh_TW", "en", "foo"],
        );
    });
    it("should respect $LANGUAGE", () => {
        assert.deepEqual(
            guessEnvLocale({
                LANGUAGE: "ja:zh_TW:en",
                LANG: "zh_TW",
            }),
            ["ja", "zh_TW", "en"],
        );
        assert.deepEqual(
            guessEnvLocale({
                LANGUAGE: "ja:zh_TW:en",
                LANG: "foo",
            }),
            ["ja", "zh_TW", "en", "foo"],
        );
    });
    it("should be empty if LANG is C or POSIX", () => {
        assert.equal(
            guessEnvLocale({
                LANG: "C.UTF-8",
                LC_ALL: "zh_TW",
                LANGUAGE: "ja:zh_TW:en",
            }),
            undefined,
        );
        assert.equal(
            guessEnvLocale({
                LANG: "POSIX",
                LC_ALL: "zh_TW",
                LANGUAGE: "ja:zh_TW:en",
            }),
            undefined,
        );
        assert.equal(
            guessEnvLocale({
                LANG: "C",
                LC_ALL: "zh_TW",
            }),
            undefined,
        );
    });
});

describe("Gettext", function () {
    /** @type {Gettext} */
    var gt;
    /** @type {import('gettext-parser').GetTextTranslations} */
    var jsonFile;

    beforeEach(function () {
        gt = new Gettext();
        jsonFile = JSON.parse(
            fs.readFileSync(import.meta.dirname + "/fixtures/latin13.json", {
                encoding: "utf-8",
            }),
        );
    });

    describe("#constructor", function () {
        var gtc;

        beforeEach(function () {
            gtc = null;
        });

        describe("translations", function () {
            it("should store added translations", function () {
                gt = new Gettext({
                    translations: {
                        "et-EE": jsonFile,
                    },
                });
                assert.ok(gt.catalogs.get("et-EE"));
                assert.equal(gt.catalogs.get("et-EE")?.charset, "iso-8859-13");
            });
        });
        describe("#sourceLocale option", function () {
            it("should accept any string as a locale", function () {
                gtc = new Gettext({ sourceLocale: "en-US" });
                assert.equal(gtc.sourceLocale, "en-US");
                gtc = new Gettext({ sourceLocale: "01234" });
                assert.equal(gtc.sourceLocale, "01234");
            });

            it("should default to en empty string", function () {
                assert.equal(new Gettext().sourceLocale, "");
            });
        });
    });

    describe("#getLocales", function () {
        it("can return all locales in the catalog", function () {
            gt = new Gettext({
                translations: {
                    "et-EE": jsonFile,
                },
            });
            assert.deepEqual([...gt.getLocales()], ["et-EE"]);
        });
    });

    describe("Resolve translations", function () {
        /** @type {ReturnType<Gettext["bindLocale"]>} */
        let fns;
        beforeEach(() => {
            fns = new Gettext({
                translations: {
                    "et-EE": jsonFile,
                },
            }).bindLocale("et-EE");
        });

        describe("#gettext", function () {
            it("should return singular from default context", function () {
                assert.equal(fns.gettext("o2-1"), "t2-1");
            });
        });

        describe("#ngettext", function () {
            it("should return plural from default context", function () {
                assert.equal(fns.ngettext("o2-1", "o2-2", 2), "t2-2");
            });
        });

        describe("#pgettext", function () {
            it("should return singular from selected context", function () {
                assert.equal(fns.pgettext("c2", "co2-1"), "ct2-1");
            });
        });

        describe("#npgettext", function () {
            it("should return plural from selected context", function () {
                assert.equal(fns.npgettext("c2", "co2-1", "co2-2", 2), "ct2-2");
            });
        });
    });

    describe("Unresolvable transaltions", function () {
        /** @type {ReturnType<Gettext["bindLocale"]>["gettext"]} */
        let gettext;
        /** @type {ReturnType<Gettext["bindLocale"]>["npgettext"]} */
        let npgettext;
        beforeEach(() => {
            const fns = new Gettext({
                translations: {
                    "et-EE": jsonFile,
                },
            }).bindLocale("et-EE");
            gettext = fns.gettext;
            npgettext = fns.npgettext;
        });

        it("should pass msgid when no translation is found", function () {
            assert.equal(gettext("unknown phrase"), "unknown phrase");
            assert.equal(npgettext("unknown context", "hello"), "hello");

            // we don't have a "no locale is set yet" state anymore
            // 'o2-1' is translated, but no locale has been set yet
            // assert.equal(npgettext("", "o2-1"), "o2-1");
        });

        it("should pass unresolved singular message when count is 1", function () {
            assert.equal(
                npgettext("", "0 matches", "multiple matches", 1),
                "0 matches",
            );
        });

        it("should pass unresolved plural message when count > 1", function () {
            assert.equal(
                npgettext("", "0 matches", "multiple matches", 100),
                "multiple matches",
            );
        });
    });
});

describe("Tests using examples", () => {
    /** @type {Gettext} */
    let gt;
    beforeEach(async () => {
        const { loadTranslations } = await import("../lib/loaders.js");
        gt = new Gettext({
            translations: loadTranslations(
                import.meta.dirname + "/../examples/hello/po",
            ),
        });
    });
    describe("Fallback to another specified language", () => {
        it("Singular", () => {
            const { _ } = gt.bindLocale(["xx-test", "ja"]);
            assert.equal(_("Hello world!"), "世界へようこそ！");
        });
        it("Plural", () => {
            const { ngettext } = gt.bindLocale(["xx-test", "ja"]);
            assert.equal(
                ngettext(
                    "You provided %s positional argument.",
                    "You provided %s positional arguments.",
                    1,
                ),
                "From xx-test: %1 positional argument.",
            );
            assert.equal(
                ngettext(
                    "You provided %s positional argument.",
                    "You provided %s positional arguments.",
                    2,
                ),
                "%s 個の引数を提供しました。",
            );
        });
    });
    describe("C and POSIX locales", () => {
        it('should return msgid for "C" locale', () => {
            const { _ } = gt.bindLocale("C");
            assert.equal(_("Hello world!"), "Hello world!");
        });
        it('should return msgid for "C.UTF-8" locale', () => {
            const { _ } = gt.bindLocale("C.UTF-8");
            assert.equal(_("Hello world!"), "Hello world!");
        });
        it('should return msgid for "POSIX" locale', () => {
            const { _ } = gt.bindLocale("POSIX");
            assert.equal(_("Hello world!"), "Hello world!");
        });
    });
});

describe("Performance", () => {
    /** @type (n: number, body: (...args: any[]) => any) => number */
    function bench(n, body) {
        const before = performance.now();
        for (let i = 0; i < n; i++) {
            body();
        }
        const after = performance.now();
        return after - before;
    }
    function init() {
        return new Gettext({
            translations: {
                uk: po.parse(
                    fs.readFileSync(
                        import.meta.dirname + "/fixtures/dolphin-uk.po",
                        {
                            encoding: "utf-8",
                        },
                    ),
                ),
            },
        });
    }

    it("should load fast", () => {
        const ms = bench(1000, () => {
            const gt = init();
        });
        console.log(`1000 runs of \`new Gettext()\` took ${ms}ms`);
        assert.ok(ms < 500);
    });
    it("should bindLocale fast", () => {
        const n = 1000000;
        const gt = init();
        const ms = bench(n, () => {
            const { ngettext } = gt.bindLocale("uk");
            const value = ngettext(
                "Are you sure you want to open 1 terminal window?",
                "Are you sure you want to open %1 terminal windows?",
                10,
            );
        });
        console.log(
            `${n} runs of \`.bindLocale()\` and \`ngettext()\` took ${ms}ms`,
        );
        assert.ok(ms < 500);
    });
});

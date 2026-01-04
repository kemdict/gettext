"use strict";

import Gettext from "../lib/gettext.js";
import fs from "node:fs";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { po } from "gettext-parser";

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
            uk: {
                messages: po.parse(
                    fs.readFileSync(
                        import.meta.dirname + "/fixtures/dolphin-uk.po",
                        {
                            encoding: "utf-8",
                        },
                    ),
                ),
            },
        },
    });
}

describe("Performance", () => {
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

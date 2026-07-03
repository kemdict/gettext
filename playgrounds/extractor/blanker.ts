#!/usr/bin/env -S deno run -A
// playground for extracting function calls in a way similar to ts-blank-space
// FIXME: the comments are not kept (except incidentally when inside of a call)

import { parse as parseAstro } from "@astrojs/compiler-rs";
import { walk } from "estree-walker";
import fs from "node:fs";

import { parse as parseSvelte } from "svelte/compiler";
import { $ } from "zx";
// actually from @types/estree; "estree" does not exist as a package
import type { CallExpression, Comment, Node } from "estree";

type Range = { start: number; end: number };
type WithRange<T> = T & Range;

/** Return ranges to keep in the text that `ast` corresponds to. */
function getRanges(ast: Node) {
    const ranges: Range[] = [];
    walk(ast, {
        enter(node) {
            if (node.leadingComments) {
                for (const comment of node.leadingComments as WithRange<Comment>[]) {
                    ranges.push(comment);
                }
            }
            if (
                node.type === "CallExpression" ||
                node.type === "NewExpression"
            ) {
                ranges.push(node as WithRange<CallExpression>);
                this.skip();
            }
        },
    });
    // earliest first
    return ranges.sort((a, b) => a.start - b.start);
}

/** Return spaces that would keep the locations in the string intact,
 * replacing each *codepoint* with a space in the output. */
function getSpace(input: string, start: number, end: number): string {
    // Like getSpace from ts-blank-space's src/blank-string.ts, except working
    // with codepoints.
    let out = "";
    for (let i = start; i < end; i) {
        const codepoint = input.codePointAt(i);
        if (codepoint === undefined) throw new RangeError();
        const char = String.fromCodePoint(codepoint);

        if (char === "\n" || char === "\r") {
            out += char;
        } else {
            out += " ";
        }

        i += char.length;
    }
    return out;
}

function transform(input: string, node: Node) {
    let previousEnd = 0;
    let out = "";
    for (const range of getRanges(node)) {
        const start = Math.max(range.start, previousEnd);
        const end = range.end;
        // replace each *codepoint* with a space in the output
        out += getSpace(input, previousEnd, start);
        out += input.slice(start, end);
        previousEnd = end;
    }
    return out;
}

const sourceSvelte = fs.readFileSync("./input.svelte", { encoding: "utf-8" });
const transformedSvelte = transform(
    sourceSvelte,
    parseSvelte(sourceSvelte, { modern: true }) as unknown as Node,
);
const sourceAstro = fs.readFileSync("./input.astro", { encoding: "utf-8" });
const transformedAstro = transform(
    sourceAstro,
    parseAstro(sourceAstro).ast as Node,
);

// Unfortunately xgettext doesn't allow you to specify the file name in case you
// piped the text in.
// (Also, for some reason `-L typescript` always fails when reading from stdin.)
fs.writeFileSync("transformedSvelte", transformedSvelte);
await $({
    nothrow: true,
})`xgettext -L typescript transformedSvelte -o template.pot`;

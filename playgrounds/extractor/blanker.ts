#!/usr/bin/env -S deno run -A
// playground for extracting function calls in a way similar to ts-blank-space
// FIXME: the comments are not kept (except incidentally when inside of a call)
// TODO: this should be a CLI that takes a directory and writes to one POT file.
// (I'm writing this like a bloody prompt because I'm not currently able to just
// start hacking on it. But this is written for myself.)
// We would need to essentially copy the source directory over to a temporary
// directory in order to keep the file names.
// The blanking transforms should be done if needed. Somehow we should also do
// conditional imports (eg. only ask for the astro compiler to be imported if we
// have astro files to transform).
// If an AST does not have line information, we should nevertheless extract the
// call expressions into a file, in this case probably into one big file, then
// use xgettext --join-existing in another step to merge them in.
// The point is that we should transform files, and then call xgettext on a
// bunch of these files at once, since I'd imagine multiple --join-existing
// calls that write to the same file need to be done one by one.
// TODO: astro
// TODO: make sure we can deal with JSX

import { parse as parseAstro } from "@astrojs/compiler-rs";
import { walk } from "estree-walker";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import * as process from "node:process";

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

const sourceAstro = fs.readFileSync("./input.astro", { encoding: "utf-8" });
const transformedAstro = transform(
    sourceAstro,
    parseAstro(sourceAstro).ast as Node,
);

{
    const inputFile = "./input.svelte";
    // Unfortunately xgettext doesn't allow you to specify the file name in case
    // you piped the text in, so here I'm writing to real files.
    // (Also, for some reason `-L typescript` always fails when reading from stdin.)
    using tmp = fs.mkdtempDisposableSync(
        path.join(os.tmpdir(), "kemdict-gettext-extract-"),
    );
    const source = fs.readFileSync(inputFile, {
        encoding: "utf-8",
    });
    // Make sure to write to the current working directory and not the temporary
    // directory
    const outputPath = process.cwd();
    fs.writeFileSync(
        path.join(tmp.path, inputFile),
        transform(
            source,
            parseSvelte(source, { modern: true }) as unknown as Node,
        ),
    );
    // Here we want the input path to be relative so that if there is any issue,
    // xgettext would report it for that path instead of for the path with the
    // temporary directory in it.
    await $({
        nothrow: true,
        cwd: tmp.path,
    })`xgettext -L typescript --check=ellipsis-unicode ${inputFile} -p ${outputPath}`;
}

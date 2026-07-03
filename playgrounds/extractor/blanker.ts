// playground for extracting function calls in a way similar to ts-blank-space
// FIXME: the comments are not kept (except incidentally when inside of a call)

import { parse as parseSvelte } from "svelte/compiler";
import { parse as parseAstro } from "@astrojs/compiler-rs";
import { walk } from "estree-walker";
import type { Node, CallExpression, Comment } from "estree";

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

const sourceSvelte = `
<script>
const { _ } = gt.bindLocale("zh_TW")
_("hello")
// TRANSLATORS: This comment should be included
const message = _("world")
// xgettext: no-space-ellipsis-check
const message2 = _("worldd")
const message3 = _("worldd")
</script>

<div class={_(\`I don't think this works\`)}>{_("another message")}</div>
<div>{_(
  // TRANSLATORS: I expect this to be kept
  "foo"
)}</div>
`;
console.log(`Svelte:
${transform(
    sourceSvelte,
    parseSvelte(sourceSvelte, { modern: true }) as unknown as Node,
)}`);
const sourceAstro = `
---
const { _ } = gt.bindLocale("zh_TW")
_("hello")
// TRANSLATORS: This comment should be included
const message = _("world")
// xgettext: no-space-ellipsis-check
const message2 = _("worldd")
const message3 = _("worldd")
---

<div class={_(\`I don't think this works\`)}>{_("another message")}</div>
<div>{_(
  // TRANSLATORS: I expect this to be kept
  "foo"
)}</div>
<!-- Does this work? xgettext supports TSX. -->
<div>{ thing(<div>test</div>) }</div>
`;
console.log(`Astro:
${transform(sourceAstro, parseAstro(sourceAstro).ast as Node)}`);

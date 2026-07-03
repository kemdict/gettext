// playground for extracting function calls in a way similar to ts-blank-space

import { parse as parseSvelte } from "svelte/compiler";
import { parse as parseAstro } from "@astrojs/compiler-rs";
import { walk } from "estree-walker";
import type { Node, CallExpression } from "estree";

type WithRange<T> = T & { start: number; end: number };

/** Return an array of all CallExpressions in `ast`. */
function getCallExpressions(ast: Node) {
    const expressions: WithRange<CallExpression>[] = [];
    walk(ast, {
        enter(node) {
            if (
                node.type === "CallExpression" ||
                node.type === "NewExpression"
            ) {
                expressions.push(node as WithRange<CallExpression>);
                this.skip();
            }
        },
    });
    return expressions;
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
    for (const expr of getCallExpressions(node)) {
        const start = Math.max(expr.start, previousEnd);
        const end = expr.end;
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
transform(
    sourceSvelte,
    parseSvelte(sourceSvelte, { modern: true }) as unknown as Node,
);
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
`;
transform(sourceAstro, parseAstro(sourceAstro).ast as Node);

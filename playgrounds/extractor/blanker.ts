// playground for extracting function calls in a way similar to ts-blank-space

import { parse } from "svelte/compiler";
import { walk } from "estree-walker";
import type { Node, CallExpression, SimpleCallExpression } from "estree";

const source = `
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

function test() {
    let previousEnd = 0;
    let out = "";
    for (const expr of getCallExpressions(
        parse(source, { modern: true }) as unknown as Node,
    )) {
        const start = Math.max(expr.start, previousEnd);
        const end = expr.end;
        // replace each *codepoint* with a space in the output
        out += getSpace(source, previousEnd, start);
        out += source.slice(start, end);
        previousEnd = end;
    }
    console.log(out);
}

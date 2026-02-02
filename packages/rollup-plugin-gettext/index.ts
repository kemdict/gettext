import {
    createFilter,
    dataToEsm,
    type FilterPattern,
} from "@rollup/pluginutils";
import {
    po as poParser,
    mo as moParser,
    type GetTextPoParserOptions,
} from "gettext-parser";
import type { Plugin } from "rollup";

interface MoPluginOptions {
    include?: FilterPattern;
    exclude?: FilterPattern;
    defaultCharset?: string;
}

interface PoPluginOptions {
    include?: FilterPattern;
    exclude?: FilterPattern;
    parserOptions?: GetTextPoParserOptions;
}

export function po(options: PoPluginOptions = {}): Plugin {
    const filter = createFilter(options?.include, options?.exclude);
    return {
        name: "po",
        transform(code, id) {
            if (!/\.po$/.test(id) || !filter(id)) return;
            try {
                const parsed = poParser.parse(code, options.parserOptions);
                return {
                    code: dataToEsm(parsed, {
                        preferConst: true,
                        compact: true,
                        namedExports: false,
                    }),
                    map: { mappings: "" },
                };
            } catch (e) {
                return null;
            }
        },
    };
}

export function mo(options: MoPluginOptions = {}): Plugin {
    const filter = createFilter(options?.include, options?.exclude);
    return {
        name: "mo",
        transform(code, id) {
            if (!/\.mo$/.test(id) || !filter(id)) return;
            try {
                const parsed = moParser.parse(code, options.defaultCharset);
                return {
                    code: dataToEsm(parsed, {
                        preferConst: true,
                        compact: true,
                        namedExports: false,
                    }),
                    map: { mappings: "" },
                };
            } catch (e) {
                return null;
            }
        },
    };
}
